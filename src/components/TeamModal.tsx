import React from 'react';
import { X, Users, Award, Cpu, HardDrive, CheckCircle2, ShieldAlert, BookOpen } from 'lucide-react';

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl comic-border-thick comic-shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-red-500 hover:text-white rounded-lg comic-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-red-600 rounded-xl comic-border flex items-center justify-center">
            <Users className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <div className="inline-block px-2.5 py-0.5 bg-yellow-300 comic-border rounded text-[10px] font-bangers uppercase mb-0.5">
              COMICCRAFT PROJECT DOSSIER
            </div>
            <h2 className="font-bangers text-3xl text-stone-900 tracking-wide">
              Team & Architecture
            </h2>
          </div>
        </div>

        {/* Team Members List */}
        <div className="mb-6">
          <h3 className="font-bangers text-lg text-stone-900 mb-3 flex items-center space-x-2">
            <Award className="w-4 h-4 text-red-600" />
            <span>PROJECT TEAM MEMBERS</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* TeamLead */}
            <div className="p-3.5 bg-amber-100 rounded-xl comic-border relative">
              <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white font-bangers text-[10px] rounded border border-stone-900">
                TEAM LEAD
              </span>
              <div className="font-bangers text-lg text-stone-900 capitalize">
                aravindhan
              </div>
              <p className="text-xs text-stone-700 font-sans-clean">
                Architecture, Story Pipeline & Systems Lead
              </p>
            </div>

            {/* Member: abishek kumar */}
            <div className="p-3.5 bg-stone-50 rounded-xl comic-border">
              <span className="inline-block px-2 py-0.5 bg-stone-200 text-stone-800 font-bangers text-[10px] rounded mb-1 border border-stone-700">
                MEMBER
              </span>
              <div className="font-bangers text-base text-stone-900 capitalize">
                abishek kumar
              </div>
              <p className="text-xs text-stone-600 font-sans-clean">
                Core Development & Layout Exporters
              </p>
            </div>

            {/* Member: rithika M */}
            <div className="p-3.5 bg-stone-50 rounded-xl comic-border">
              <span className="inline-block px-2 py-0.5 bg-stone-200 text-stone-800 font-bangers text-[10px] rounded mb-1 border border-stone-700">
                MEMBER
              </span>
              <div className="font-bangers text-base text-stone-900 capitalize">
                rithika M
              </div>
              <p className="text-xs text-stone-600 font-sans-clean">
                Generative AI Integration & Prompt Engineering
              </p>
            </div>

            {/* Member: nilin jenilia */}
            <div className="p-3.5 bg-stone-50 rounded-xl comic-border">
              <span className="inline-block px-2 py-0.5 bg-stone-200 text-stone-800 font-bangers text-[10px] rounded mb-1 border border-stone-700">
                MEMBER
              </span>
              <div className="font-bangers text-base text-stone-900 capitalize">
                nilin jenilia
              </div>
              <p className="text-xs text-stone-600 font-sans-clean">
                Frontend Aesthetics & Comic Layout Design
              </p>
            </div>
          </div>

          <div className="mt-2 text-xs font-sans-clean text-stone-500 italic">
            Mentor: <span className="font-bold text-stone-700">No mentor assigned yet</span>
          </div>
        </div>

        {/* Project Stats */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-2xl comic-border">
          <h3 className="font-bangers text-base text-stone-900 mb-2">
            📊 PROJECT STATS & EPICS
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-white rounded-lg border border-stone-300">
              <div className="font-bangers text-2xl text-red-600">8</div>
              <div className="text-[11px] font-bold text-stone-600 uppercase">Total Epics</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-stone-300">
              <div className="font-bangers text-2xl text-amber-600">13</div>
              <div className="text-[11px] font-bold text-stone-600 uppercase">Total Tasks</div>
            </div>
            <div className="p-2 bg-white rounded-lg border border-stone-300">
              <div className="font-bangers text-2xl text-emerald-600">0</div>
              <div className="text-[11px] font-bold text-stone-600 uppercase">Subtasks</div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Specs */}
        <div className="mb-6">
          <h3 className="font-bangers text-lg text-stone-900 mb-2 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-amber-600" />
            <span>TECHNICAL ARCHITECTURE</span>
          </h3>

          <div className="space-y-2 text-xs font-sans-clean">
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Story Engine:</strong> Google Gemini 3.8 Flash model via @google/genai SDK for structured panel breakdown, dialogue scripting, camera angles, and character sheets.
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Illustration Pipeline:</strong> Gemini Flash Image / Diffusers pipeline with fallback procedural canvas renderer supporting 7 distinct comic art styles.
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">Layout Binding & PDF Exporters:</strong> layout_builder binding module and FPDF / jsPDF exporter producing structured timestamped deliverables.
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900">System Requirements:</strong> Intel Core i5 (8th Gen+) / AMD Ryzen 5, 8GB-16GB RAM, 256GB SSD, Modern Browser (Chrome, Firefox, Edge), Node 22 / Python 3.8+.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-yellow-300 font-bangers text-sm rounded-xl comic-border"
          >
            CLOSE DOSSIER
          </button>
        </div>

      </div>
    </div>
  );
};
