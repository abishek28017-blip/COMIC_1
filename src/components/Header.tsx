import React from 'react';
import { Sparkles, BookOpen, Users, Download, PlusCircle, RefreshCw, Zap } from 'lucide-react';
import { ComicStory } from '../types/comic';

interface HeaderProps {
  currentComic: ComicStory | null;
  onOpenNewComic: () => void;
  onSelectScenario: (scenario: 1 | 2) => void;
  onOpenTeamModal: () => void;
  onExportPDF: () => void;
  isExporting: boolean;
  activeScenario?: 1 | 2 | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentComic,
  onOpenNewComic,
  onSelectScenario,
  onOpenTeamModal,
  onExportPDF,
  isExporting,
  activeScenario,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-400 border-b-4 border-stone-900 halftone-dots shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onOpenNewComic}>
            <div className="w-11 h-11 sm:w-13 sm:h-13 bg-red-600 comic-border rounded-xl comic-shadow-sm flex items-center justify-center transform -rotate-3 hover:rotate-0 transition-transform">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 fill-yellow-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bangers text-2xl sm:text-4xl text-stone-900 tracking-wide drop-shadow-[2px_2px_0px_#ffffff]">
                  COMICCRAFT
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-red-600 text-white font-bangers text-xs rounded border-2 border-stone-900 -rotate-2">
                  AI STUDIO
                </span>
              </div>
              <p className="hidden md:block text-xs font-bold text-stone-800 -mt-1 font-comic">
                Personalized Comic Book Storylines & Vivid Illustrations
              </p>
            </div>
          </div>

          {/* Quick Scenario Starters & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Scenario 1 Button */}
            <button
              onClick={() => onSelectScenario(1)}
              className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border-2 border-stone-900 text-xs font-bold transition-all ${
                activeScenario === 1
                  ? 'bg-emerald-500 text-white comic-shadow-sm scale-105'
                  : 'bg-white hover:bg-emerald-50 text-stone-800'
              }`}
              title="Scenario 1: Todd the Fox exploring the enchanted forest (Dramatic Anime)"
            >
              <span className="text-base">🦊</span>
              <span>Scenario 1: Fox</span>
            </button>

            {/* Scenario 2 Button */}
            <button
              onClick={() => onSelectScenario(2)}
              className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border-2 border-stone-900 text-xs font-bold transition-all ${
                activeScenario === 2
                  ? 'bg-amber-300 text-stone-900 comic-shadow-sm scale-105'
                  : 'bg-white hover:bg-amber-100 text-stone-800'
              }`}
              title="Scenario 2: Funny Detective Barnaby (Classic Comic Humor)"
            >
              <span className="text-base">🕵️‍♂️</span>
              <span>Scenario 2: Funny</span>
            </button>

            {/* Create New Comic */}
            <button
              onClick={onOpenNewComic}
              className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-yellow-300 hover:bg-yellow-200 text-stone-900 rounded-lg comic-border comic-shadow-sm text-xs sm:text-sm font-bangers tracking-wide transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4 text-stone-900" />
              <span>NEW COMIC</span>
            </button>

            {/* Export PDF Button (Scenario 3) */}
            {currentComic && (
              <button
                onClick={onExportPDF}
                disabled={isExporting}
                className="flex items-center space-x-1.5 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg comic-border comic-shadow-sm text-xs sm:text-sm font-bangers tracking-wide transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
              >
                {isExporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Download className="w-4 h-4 text-yellow-300" />
                )}
                <span>EXPORT PDF</span>
              </button>
            )}

            {/* Team Credits & Architecture Modal */}
            <button
              onClick={onOpenTeamModal}
              className="p-2 sm:px-3 sm:py-2 bg-stone-900 hover:bg-stone-800 text-yellow-300 rounded-lg comic-border text-xs sm:text-sm font-bangers flex items-center space-x-1.5 transition-colors"
              title="Team Members & Technical Architecture"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">TEAM</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
