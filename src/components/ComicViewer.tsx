import React, { useState } from 'react';
import { 
  Download, 
  RefreshCw, 
  Edit3, 
  Volume2, 
  VolumeX, 
  LayoutGrid, 
  Sliders, 
  Sparkles, 
  Maximize2,
  FileText,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { ComicStory, ComicPanel, ComicLayoutType } from '../types/comic';

interface ComicViewerProps {
  comic: ComicStory;
  onUpdateComic: (updated: ComicStory) => void;
  onExportPDF: () => void;
  isExporting: boolean;
  onRegenerateAll: () => void;
  isRegeneratingAll: boolean;
  onOpenEditForm: () => void;
  onSelectPanelForEdit: (panel: ComicPanel) => void;
}

export const ComicViewer: React.FC<ComicViewerProps> = ({
  comic,
  onUpdateComic,
  onExportPDF,
  isExporting,
  onRegenerateAll,
  isRegeneratingAll,
  onOpenEditForm,
  onSelectPanelForEdit,
}) => {
  const [layout, setLayout] = useState<ComicLayoutType>(comic.layout || 'grid-2x2');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAudioPanel, setActiveAudioPanel] = useState<number | null>(null);

  const handleLayoutChange = (newLayout: ComicLayoutType) => {
    setLayout(newLayout);
    onUpdateComic({
      ...comic,
      layout: newLayout,
    });
  };

  // Web Speech API: Narration Player
  const handlePlayFullComicAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setActiveAudioPanel(null);
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlayingAudio(true);

    let panelIdx = 0;
    const playNext = () => {
      if (panelIdx >= comic.panels.length) {
        setIsPlayingAudio(false);
        setActiveAudioPanel(null);
        return;
      }

      const panel = comic.panels[panelIdx];
      setActiveAudioPanel(panel.panelNumber);

      const dialogueLines = panel.dialogues
        .map((d) => `${d.speaker} says: ${d.text}`)
        .join('. ');

      const text = `Panel ${panel.panelNumber}. ${panel.narration}. ${dialogueLines}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onend = () => {
        panelIdx++;
        playNext();
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setActiveAudioPanel(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNext();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner Ribbon */}
      <div className="bg-amber-300 comic-border-thick comic-shadow-lg rounded-2xl p-5 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Comic Title & Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-red-600 text-white font-bangers text-xs rounded border border-stone-900">
                ISSUE #1
              </span>
              <span className="px-2.5 py-0.5 bg-stone-900 text-yellow-300 font-bangers text-xs rounded border border-stone-900 uppercase">
                TONE: {comic.tone}
              </span>
              <span className="px-2.5 py-0.5 bg-white text-stone-900 font-bangers text-xs rounded border border-stone-900 uppercase">
                STYLE: {comic.artStyle}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-bangers text-stone-900 tracking-wide">
              {comic.title}
            </h1>
            <p className="text-stone-700 font-comic text-xs sm:text-sm mt-0.5">
              {comic.subtitle} • Starring <span className="font-bold underline">{comic.characterName}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Audio Reader */}
            <button
              type="button"
              onClick={handlePlayFullComicAudio}
              className={`px-3 py-2 rounded-xl comic-border font-bangers text-xs sm:text-sm flex items-center space-x-1.5 transition-all ${
                isPlayingAudio
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-white hover:bg-yellow-100 text-stone-900 comic-shadow-sm'
              }`}
              title="Read comic story and dialogues aloud"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-white" />
                  <span>STOP NARRATION</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-red-600" />
                  <span>READ ALOUD</span>
                </>
              )}
            </button>

            {/* Edit / Customize Premise */}
            <button
              type="button"
              onClick={onOpenEditForm}
              className="px-3 py-2 bg-white hover:bg-yellow-100 text-stone-900 rounded-xl comic-border comic-shadow-sm font-bangers text-xs sm:text-sm flex items-center space-x-1.5 transition-all"
            >
              <Edit3 className="w-4 h-4 text-stone-900" />
              <span>CUSTOMIZE</span>
            </button>

            {/* Export PDF (Scenario 3) */}
            <button
              type="button"
              onClick={onExportPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl comic-border comic-shadow-sm font-bangers text-xs sm:text-sm flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Download className="w-4 h-4 text-yellow-300" />
              )}
              <span>DOWNLOAD PDF</span>
            </button>

          </div>
        </div>

        {/* Layout Switcher Bar */}
        <div className="mt-4 pt-4 border-t-2 border-stone-800 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bangers text-stone-800 text-xs sm:text-sm uppercase">
              Layout Binding:
            </span>
            <div className="inline-flex rounded-lg comic-border bg-white p-0.5">
              <button
                type="button"
                onClick={() => handleLayoutChange('grid-2x2')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  layout === 'grid-2x2' ? 'bg-stone-900 text-yellow-300' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                2x2 Grid
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange('strip-horizontal')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  layout === 'strip-horizontal' ? 'bg-stone-900 text-yellow-300' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                Horizontal Strip
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange('webtoon-vertical')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  layout === 'webtoon-vertical' ? 'bg-stone-900 text-yellow-300' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                Webtoon Scroll
              </button>
              <button
                type="button"
                onClick={() => handleLayoutChange('magazine-page')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  layout === 'magazine-page' ? 'bg-stone-900 text-yellow-300' : 'text-stone-700 hover:text-stone-900'
                }`}
              >
                Comic Page
              </button>
            </div>
          </div>

          <div className="text-[11px] text-stone-700 font-comic italic">
            Tip: Click on any panel to edit narration, dialogue, or re-render art!
          </div>
        </div>
      </div>

      {/* Comic Panels Board */}
      <div className="bg-stone-100/80 p-4 sm:p-8 rounded-3xl comic-border-thick comic-shadow-xl halftone-dots">
        
        {/* Layout: 2x2 Grid */}
        {layout === 'grid-2x2' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {comic.panels.map((panel) => (
              <PanelCard
                key={panel.panelNumber}
                panel={panel}
                isActiveAudio={activeAudioPanel === panel.panelNumber}
                onSelectForEdit={onSelectPanelForEdit}
              />
            ))}
          </div>
        )}

        {/* Layout: Horizontal Strip */}
        {layout === 'strip-horizontal' && (
          <div className="flex flex-col lg:flex-row gap-4 overflow-x-auto pb-4">
            {comic.panels.map((panel) => (
              <div key={panel.panelNumber} className="flex-1 min-w-[280px]">
                <PanelCard
                  panel={panel}
                  isActiveAudio={activeAudioPanel === panel.panelNumber}
                  onSelectForEdit={onSelectPanelForEdit}
                />
              </div>
            ))}
          </div>
        )}

        {/* Layout: Webtoon Vertical */}
        {layout === 'webtoon-vertical' && (
          <div className="max-w-2xl mx-auto space-y-8">
            {comic.panels.map((panel) => (
              <PanelCard
                key={panel.panelNumber}
                panel={panel}
                isActiveAudio={activeAudioPanel === panel.panelNumber}
                onSelectForEdit={onSelectPanelForEdit}
              />
            ))}
          </div>
        )}

        {/* Layout: Magazine Page */}
        {layout === 'magazine-page' && (
          <div className="space-y-6">
            {/* Top row: first panel takes large spotlight */}
            {comic.panels.length > 0 && (
              <div className="w-full">
                <PanelCard
                  panel={comic.panels[0]}
                  isActiveAudio={activeAudioPanel === comic.panels[0].panelNumber}
                  onSelectForEdit={onSelectPanelForEdit}
                  isHero
                />
              </div>
            )}
            {/* Subsequent panels in 3-column or 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comic.panels.slice(1).map((panel) => (
                <PanelCard
                  key={panel.panelNumber}
                  panel={panel}
                  isActiveAudio={activeAudioPanel === panel.panelNumber}
                  onSelectForEdit={onSelectPanelForEdit}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Info / Project Meta */}
      <div className="mt-8 text-center text-xs text-stone-500 font-sans-clean">
        ComicCraft AI Studio • Generated with Gemini 3.8 Flash Story Engine & Styled Comic Illustration Pipeline
      </div>

    </div>
  );
};

// ==========================================
// Individual Panel Card Component
// ==========================================
interface PanelCardProps {
  panel: ComicPanel;
  isActiveAudio: boolean;
  onSelectForEdit: (panel: ComicPanel) => void;
  isHero?: boolean;
}

const PanelCard: React.FC<PanelCardProps> = ({
  panel,
  isActiveAudio,
  onSelectForEdit,
  isHero = false,
}) => {
  return (
    <div
      onClick={() => onSelectForEdit(panel)}
      className={`group bg-white rounded-2xl comic-border-thick transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
        isActiveAudio
          ? 'ring-4 ring-red-500 scale-[1.01] comic-shadow-lg'
          : 'hover:-translate-y-1 hover:comic-shadow-lg comic-shadow'
      }`}
    >
      {/* Top Ribbon: Panel #, Shot Type & Edit Button */}
      <div className="bg-stone-900 text-white px-3 py-1.5 flex items-center justify-between border-b-2 border-stone-900">
        <div className="flex items-center space-x-2">
          <span className="font-bangers text-yellow-300 text-xs sm:text-sm tracking-wider">
            PANEL #{panel.panelNumber}
          </span>
          <span className="text-[10px] text-stone-300 font-bold bg-stone-800 px-1.5 py-0.5 rounded">
            {panel.cameraAngle}
          </span>
        </div>
        <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-3.5 h-3.5 text-yellow-300" />
          <span className="text-[10px] font-bold text-yellow-300 uppercase">Edit</span>
        </div>
      </div>

      {/* Narration Caption Box (Classic Comic Yellow Box) */}
      <div className="p-3 bg-yellow-200 border-b-2 border-stone-900 relative">
        <span className="text-[10px] font-bangers tracking-wider text-amber-900 uppercase block -mb-0.5">
          NARRATOR:
        </span>
        <p className="font-comic text-xs sm:text-sm text-stone-900 leading-snug">
          {panel.narration}
        </p>
      </div>

      {/* Illustration Area with Sound Effect Overlay */}
      <div className="relative bg-stone-100 aspect-square sm:aspect-[4/3] overflow-hidden flex items-center justify-center">
        {panel.imageUrl ? (
          <img
            src={panel.imageUrl}
            alt={panel.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="text-stone-400 font-comic text-xs">
            Inking Panel Art...
          </div>
        )}

        {/* Dynamic Comic Sound Effect Burst */}
        {panel.soundEffect && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-300 text-red-600 font-bangers text-xl sm:text-2xl comic-border rounded-lg rotate-12 drop-shadow-md select-none pointer-events-none transform group-hover:scale-110 transition-transform">
            {panel.soundEffect.toUpperCase()}
          </div>
        )}

        {/* Hover Click To Edit Overlay */}
        <div className="absolute inset-0 bg-stone-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="bg-white px-3 py-1.5 rounded-lg comic-border font-bangers text-xs text-stone-900 flex items-center space-x-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-red-600" />
            <span>CLICK TO INSPECT & EDIT</span>
          </div>
        </div>
      </div>

      {/* Dialogue Area (Speech / Thought / Shout Balloons) */}
      <div className="p-3 sm:p-4 bg-white space-y-2 border-t-2 border-stone-900 min-h-[90px]">
        {panel.dialogues.map((d, idx) => {
          const isThought = d.type === 'thought';
          const isShout = d.type === 'shout';

          return (
            <div
              key={d.id || idx}
              className={`p-2.5 rounded-xl border-2 border-stone-900 text-xs ${
                isShout
                  ? 'bg-red-50 text-red-950 font-bold border-red-600 rotate-0.5'
                  : isThought
                  ? 'bg-blue-50 text-blue-950 rounded-2xl italic'
                  : 'bg-white text-stone-900'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-0.5">
                <span className="font-bangers text-red-600 text-[11px] uppercase">
                  {d.speaker}
                  {isThought ? ' (THOUGHT)' : isShout ? ' (SHOUT!)' : ''}:
                </span>
              </div>
              <p className="font-comic text-xs text-stone-800 leading-snug">
                "{d.text}"
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
