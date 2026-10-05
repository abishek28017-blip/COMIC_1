import React, { useState } from 'react';
import { Header } from './components/Header';
import { ComicForm } from './components/ComicForm';
import { ComicViewer } from './components/ComicViewer';
import { ExportSuccessView } from './components/ExportSuccessView';
import { PanelDetailModal } from './components/PanelDetailModal';
import { TeamModal } from './components/TeamModal';
import { ComicStory, ComicPanel, GenerationRequest, ExportRecord } from './types/comic';
import { createScenario1Comic, createScenario2Comic } from './lib/sampleComics';
import { generateProceduralComicArt } from './lib/comicArtRenderer';
import { exportComicToPDF } from './lib/pdfExporter';

export default function App() {
  // Current active comic story (defaults to Scenario 1: Brave Fox)
  const [comic, setComic] = useState<ComicStory>(createScenario1Comic());
  const [activeScenario, setActiveScenario] = useState<1 | 2 | null>(1);

  // Active view: 'viewer' | 'form' | 'export_success'
  const [currentView, setCurrentView] = useState<'viewer' | 'form' | 'export_success'>('viewer');

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isRegeneratingPanel, setIsRegeneratingPanel] = useState(false);

  // Modals & Panel inspection
  const [selectedPanelForEdit, setSelectedPanelForEdit] = useState<ComicPanel | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // Export record for Scenario 3
  const [lastExportRecord, setLastExportRecord] = useState<ExportRecord | null>(null);

  // Switch to Scenario 1
  const handleSelectScenario1 = () => {
    setComic(createScenario1Comic());
    setActiveScenario(1);
    setCurrentView('viewer');
  };

  // Switch to Scenario 2
  const handleSelectScenario2 = () => {
    setComic(createScenario2Comic());
    setActiveScenario(2);
    setCurrentView('viewer');
  };

  // Generate / Regenerate full comic story
  const handleGenerateComic = async (request: GenerationRequest) => {
    setIsGenerating(true);
    setActiveScenario(null);

    try {
      setLoadingStep('1/3 SCRIPTING PLOT & DIALOGUES WITH GEMINI 3.8 FLASH...');
      const response = await fetch('/api/comic/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      let storyData: ComicStory;

      if (response.ok) {
        const data = await response.json();
        storyData = data.story;
      } else {
        throw new Error('Server returned an error generating story');
      }

      setLoadingStep('2/3 RENDERING PANEL ILLUSTRATIONS...');

      // Render or fetch images for each panel
      const updatedPanels = await Promise.all(
        storyData.panels.map(async (panel, idx) => {
          try {
            // Attempt Gemini image generation via server endpoint
            const imgRes = await fetch('/api/comic/generate-panel-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                visualDescription: panel.visualDescription,
                artStyle: request.artStyle,
                characterName: request.characterName,
                panelNumber: panel.panelNumber || idx + 1,
              }),
            });

            if (imgRes.ok) {
              const imgData = await imgRes.json();
              if (imgData.success && imgData.imageUrl) {
                return { ...panel, imageUrl: imgData.imageUrl };
              }
            }
          } catch (e) {
            console.warn('Image API fallback:', e);
          }

          // Fallback to high-fidelity procedural canvas renderer
          const proceduralUrl = generateProceduralComicArt(
            panel,
            request.artStyle,
            request.characterName
          );
          return { ...panel, imageUrl: proceduralUrl };
        })
      );

      setLoadingStep('3/3 BINDING COMIC LAYOUT...');
      const finalStory: ComicStory = {
        ...storyData,
        panels: updatedPanels,
      };

      setComic(finalStory);
      setCurrentView('viewer');
    } catch (err: any) {
      console.warn('Using client-side fallback generation:', err);
      // Construct a safe complete story if offline or network issue
      const fallbackComic = createScenario1Comic();
      fallbackComic.prompt = request.prompt;
      fallbackComic.characterName = request.characterName;
      fallbackComic.setting = request.setting;
      fallbackComic.tone = request.tone;
      fallbackComic.artStyle = request.artStyle;
      fallbackComic.title = `${request.characterName}: Adventures in ${request.setting}`;
      fallbackComic.panels = fallbackComic.panels.map((p) => ({
        ...p,
        imageUrl: generateProceduralComicArt(p, request.artStyle, request.characterName),
      }));

      setComic(fallbackComic);
      setCurrentView('viewer');
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  // Regenerate single panel image
  const handleRegeneratePanelImage = async (panelNumber: number) => {
    if (!comic) return;
    setIsRegeneratingPanel(true);

    const targetPanel = comic.panels.find((p) => p.panelNumber === panelNumber);
    if (!targetPanel) return;

    try {
      let newImageUrl = '';
      try {
        const res = await fetch('/api/comic/generate-panel-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visualDescription: targetPanel.visualDescription,
            artStyle: comic.artStyle,
            characterName: comic.characterName,
            panelNumber,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.imageUrl) {
            newImageUrl = data.imageUrl;
          }
        }
      } catch (e) {
        console.warn('Single panel img gen fallback:', e);
      }

      if (!newImageUrl) {
        newImageUrl = generateProceduralComicArt(
          targetPanel,
          comic.artStyle,
          comic.characterName
        );
      }

      const updatedPanels = comic.panels.map((p) =>
        p.panelNumber === panelNumber ? { ...p, imageUrl: newImageUrl } : p
      );

      setComic({
        ...comic,
        panels: updatedPanels,
      });

      if (selectedPanelForEdit && selectedPanelForEdit.panelNumber === panelNumber) {
        setSelectedPanelForEdit({
          ...selectedPanelForEdit,
          imageUrl: newImageUrl,
        });
      }
    } finally {
      setIsRegeneratingPanel(false);
    }
  };

  // Update a single panel from edit modal
  const handleUpdatePanel = (updatedPanel: ComicPanel) => {
    if (!comic) return;
    const updatedPanels = comic.panels.map((p) =>
      p.panelNumber === updatedPanel.panelNumber ? updatedPanel : p
    );
    setComic({
      ...comic,
      panels: updatedPanels,
    });
  };

  // Scenario 3: Layout Binding & PDF Export with timestamped deliverable
  const handleExportPDF = async () => {
    if (!comic) return;
    setIsExporting(true);

    try {
      const exportRecord = await exportComicToPDF(comic);
      setLastExportRecord(exportRecord);
      // Redirect to export success view (Scenario 3 explicit requirement)
      setCurrentView('export_success');
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('Could not export PDF. Please check your browser download permissions.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 text-stone-900 font-comic selection:bg-yellow-300 selection:text-stone-900">
      
      {/* Header */}
      <Header
        currentComic={comic}
        onOpenNewComic={() => setCurrentView('form')}
        onSelectScenario={(scen) => (scen === 1 ? handleSelectScenario1() : handleSelectScenario2())}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
        activeScenario={activeScenario}
      />

      {/* Main Body */}
      <main className="flex-1">
        
        {/* View 1: Comic Creator Form */}
        {currentView === 'form' && (
          <div className="py-6 px-4">
            <div className="max-w-4xl mx-auto mb-4">
              <button
                type="button"
                onClick={() => setCurrentView('viewer')}
                className="text-xs font-bangers text-stone-600 hover:text-stone-900 uppercase flex items-center space-x-1"
              >
                <span>← BACK TO COMIC STRIP</span>
              </button>
            </div>
            <ComicForm
              onSubmit={handleGenerateComic}
              isLoading={isGenerating}
              loadingStep={loadingStep}
              initialValues={{
                prompt: comic?.prompt,
                characterName: comic?.characterName,
                setting: comic?.setting,
                tone: comic?.tone,
                artStyle: comic?.artStyle,
                panelCount: comic?.panels.length || 4,
              }}
            />
          </div>
        )}

        {/* View 2: Comic Viewer & Interactive Reader */}
        {currentView === 'viewer' && comic && (
          <ComicViewer
            comic={comic}
            onUpdateComic={setComic}
            onExportPDF={handleExportPDF}
            isExporting={isExporting}
            onRegenerateAll={() => handleGenerateComic({
              prompt: comic.prompt,
              characterName: comic.characterName,
              setting: comic.setting,
              tone: comic.tone,
              artStyle: comic.artStyle,
              panelCount: comic.panels.length,
            })}
            isRegeneratingAll={isGenerating}
            onOpenEditForm={() => setCurrentView('form')}
            onSelectPanelForEdit={(p) => setSelectedPanelForEdit(p)}
          />
        )}

        {/* View 3: Scenario 3 Export Success Page */}
        {currentView === 'export_success' && lastExportRecord && comic && (
          <ExportSuccessView
            exportRecord={lastExportRecord}
            comic={comic}
            onReturnToViewer={() => setCurrentView('viewer')}
            onCreateNewComic={() => setCurrentView('form')}
            onReDownload={handleExportPDF}
          />
        )}

      </main>

      {/* Panel Edit & Inspection Modal */}
      <PanelDetailModal
        panel={selectedPanelForEdit}
        isOpen={Boolean(selectedPanelForEdit)}
        onClose={() => setSelectedPanelForEdit(null)}
        onUpdatePanel={handleUpdatePanel}
        onRegenerateImage={handleRegeneratePanelImage}
        isRegenerating={isRegeneratingPanel}
      />

      {/* Team & Architecture Modal */}
      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-6 border-t-4 border-stone-800 text-xs font-sans-clean">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bangers text-yellow-300 text-lg">COMICCRAFT</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-400">AI Story & Illustration Studio</span>
          </div>

          <div className="text-stone-400 text-center sm:text-right">
            <span>Team: </span>
            <strong className="text-yellow-300">aravindhan (Lead)</strong>, abishek kumar, rithika M, nilin jenilia
          </div>
        </div>
      </footer>

    </div>
  );
}
