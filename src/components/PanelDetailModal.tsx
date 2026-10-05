import React, { useState } from 'react';
import { X, RefreshCw, Volume2, Sparkles, MessageSquare, Tag, Image as ImageIcon } from 'lucide-react';
import { ComicPanel, BubbleType } from '../types/comic';

interface PanelDetailModalProps {
  panel: ComicPanel | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePanel: (updatedPanel: ComicPanel) => void;
  onRegenerateImage: (panelNumber: number) => void;
  isRegenerating: boolean;
}

export const PanelDetailModal: React.FC<PanelDetailModalProps> = ({
  panel,
  isOpen,
  onClose,
  onUpdatePanel,
  onRegenerateImage,
  isRegenerating,
}) => {
  if (!isOpen || !panel) return null;

  const [narration, setNarration] = useState(panel.narration);
  const [soundEffect, setSoundEffect] = useState(panel.soundEffect || '');
  const [dialogues, setDialogues] = useState(panel.dialogues);

  const handleSave = () => {
    onUpdatePanel({
      ...panel,
      narration,
      soundEffect,
      dialogues,
    });
    onClose();
  };

  const updateDialogueText = (index: number, text: string) => {
    const updated = [...dialogues];
    updated[index].text = text;
    setDialogues(updated);
  };

  const updateDialogueType = (index: number, type: BubbleType) => {
    const updated = [...dialogues];
    updated[index].type = type;
    setDialogues(updated);
  };

  const handleReadAloud = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `${panel.narration}. ${dialogues.map((d) => `${d.speaker} says: ${d.text}`).join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl comic-border-thick comic-shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-red-500 hover:text-white rounded-lg comic-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="px-3 py-1 bg-red-600 text-white font-bangers text-lg rounded-lg comic-border">
            PANEL #{panel.panelNumber}
          </div>
          <div>
            <h3 className="font-bangers text-2xl text-stone-900">
              {panel.title}
            </h3>
            <p className="text-xs text-stone-500 font-sans-clean">
              {panel.setting} • {panel.cameraAngle}
            </p>
          </div>
        </div>

        {/* Main Content: Illustration & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Image & Image Action */}
          <div>
            <div className="relative rounded-xl overflow-hidden comic-border comic-shadow-sm bg-stone-100 aspect-square">
              {panel.imageUrl ? (
                <img
                  src={panel.imageUrl}
                  alt={panel.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-stone-400">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}

              {/* Sound effect badge overlay */}
              {soundEffect && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-400 text-red-600 font-bangers text-xl comic-border rounded rotate-6 shadow-md">
                  {soundEffect.toUpperCase()}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onRegenerateImage(panel.panelNumber)}
                disabled={isRegenerating}
                className="w-full py-2 px-4 bg-amber-400 hover:bg-amber-300 text-stone-900 rounded-lg comic-border text-xs font-bangers flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'REGENERATING ART...' : 'REGENERATE ART'}</span>
              </button>
            </div>
            
            <p className="text-[11px] text-stone-500 font-sans-clean mt-2 italic">
              Prompt: {panel.visualDescription}
            </p>
          </div>

          {/* Text Editing Form */}
          <div className="space-y-4">
            
            {/* Narration caption */}
            <div>
              <label className="block text-xs font-bangers text-stone-800 uppercase mb-1 flex items-center justify-between">
                <span>Narrator Caption Box:</span>
                <span className="text-[10px] text-amber-700 bg-yellow-200 px-1.5 py-0.5 rounded">Top Ribbon</span>
              </label>
              <textarea
                rows={3}
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
                className="w-full p-2.5 bg-yellow-50 rounded-lg comic-border font-comic text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Sound Effect Input */}
            <div>
              <label className="block text-xs font-bangers text-stone-800 uppercase mb-1">
                💥 Sound Effect (SFX):
              </label>
              <input
                type="text"
                value={soundEffect}
                onChange={(e) => setSoundEffect(e.target.value)}
                placeholder="e.g. POW!, WHOOSH!, CRASH!"
                className="w-full p-2 bg-stone-50 rounded-lg comic-border font-bangers text-sm text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 uppercase"
              />
            </div>

            {/* Dialogues */}
            <div>
              <label className="block text-xs font-bangers text-stone-800 uppercase mb-1.5">
                💬 Dialogue & Speech Balloons:
              </label>
              <div className="space-y-3">
                {dialogues.map((diag, idx) => (
                  <div key={diag.id || idx} className="p-3 bg-stone-50 rounded-xl border border-stone-300">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bangers text-xs text-red-600">
                        {diag.speaker}:
                      </span>
                      <select
                        value={diag.type}
                        onChange={(e) => updateDialogueType(idx, e.target.value as BubbleType)}
                        className="text-[11px] font-bold bg-white border border-stone-300 rounded px-1.5 py-0.5"
                      >
                        <option value="speech">Speech Bubble</option>
                        <option value="shout">Shout / Exclamation</option>
                        <option value="thought">Thought Cloud</option>
                        <option value="whisper">Whisper</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={diag.text}
                      onChange={(e) => updateDialogueText(idx, e.target.value)}
                      className="w-full p-2 bg-white rounded border border-stone-300 font-comic text-xs text-stone-900"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Read Aloud Button */}
            <button
              type="button"
              onClick={handleReadAloud}
              className="flex items-center space-x-2 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-300"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Listen to Panel Audio</span>
            </button>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bangers text-sm rounded-lg"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bangers text-sm rounded-lg comic-border comic-shadow-sm"
          >
            SAVE CHANGES
          </button>
        </div>

      </div>
    </div>
  );
};
