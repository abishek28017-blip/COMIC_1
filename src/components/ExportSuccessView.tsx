import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle, 
  Download, 
  FileText, 
  Printer, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  Calendar,
  Share2,
  BookOpen
} from 'lucide-react';
import { ComicStory, ExportRecord } from '../types/comic';

interface ExportSuccessViewProps {
  exportRecord: ExportRecord;
  comic: ComicStory;
  onReturnToViewer: () => void;
  onCreateNewComic: () => void;
  onReDownload: () => void;
}

export const ExportSuccessView: React.FC<ExportSuccessViewProps> = ({
  exportRecord,
  comic,
  onReturnToViewer,
  onCreateNewComic,
  onReDownload,
}) => {
  useEffect(() => {
    // Launch celebratory comic confetti explosion
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#facc15', '#3b82f6', '#10b981', '#8b5cf6'],
    });
  }, []);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return 'Approx. 1.2 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Success Card Banner */}
      <div className="bg-white rounded-3xl comic-border-thick comic-shadow-xl overflow-hidden p-6 sm:p-10 relative">
        
        {/* Top Celebration Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500 text-white rounded-2xl comic-border comic-shadow mb-4 transform -rotate-3">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          
          <div className="inline-block px-3 py-1 bg-yellow-300 text-stone-900 comic-border rounded-full text-xs font-bangers tracking-wider uppercase mb-2">
            ✦ SCENARIO 3: PDF EXPORT SUCCESS ✦
          </div>

          <h1 className="text-3xl sm:text-5xl font-bangers text-stone-900 tracking-wide uppercase drop-shadow-[2px_2px_0px_#facc15]">
            Comic Book Exported!
          </h1>
          <p className="text-stone-600 font-comic text-sm sm:text-base max-w-lg mx-auto mt-2">
            Your personalized comic has been bound into a professional print-ready PDF with high-resolution panels, dialogue bubbles, and issue cover.
          </p>
        </div>

        {/* Deliverable Metadata Card */}
        <div className="bg-amber-50 rounded-2xl comic-border p-5 sm:p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b-2 border-stone-800">
            <FileText className="w-5 h-5 text-red-600" />
            <h3 className="font-bangers text-lg text-stone-900 uppercase tracking-wide">
              PDF Deliverable Specifications
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans-clean">
            <div className="p-3 bg-white rounded-xl border border-stone-300">
              <span className="text-stone-500 block mb-0.5 font-bold uppercase text-[10px]">
                Timestamped Filename
              </span>
              <span className="font-mono text-stone-900 font-bold break-all">
                {exportRecord.filename}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-300">
              <span className="text-stone-500 block mb-0.5 font-bold uppercase text-[10px]">
                Comic Title & Issue
              </span>
              <span className="font-bold text-stone-900 font-comic text-sm">
                {comic.title} (Issue #1)
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-300">
              <span className="text-stone-500 block mb-0.5 font-bold uppercase text-[10px]">
                Page Count & Format
              </span>
              <span className="font-bold text-stone-900">
                {exportRecord.pageCount} Pages (A4 Portrait • Cover Page + Panel Storyboard)
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-300">
              <span className="text-stone-500 block mb-0.5 font-bold uppercase text-[10px]">
                Estimated File Size
              </span>
              <span className="font-bold text-stone-900">
                {formatBytes(exportRecord.fileSizeBytes)}
              </span>
            </div>
          </div>
        </div>

        {/* Mini Preview Snapshot */}
        <div className="mb-8 p-4 bg-stone-100 rounded-2xl comic-border flex flex-col sm:flex-row items-center gap-4">
          {comic.panels[0]?.imageUrl && (
            <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden comic-border bg-white">
              <img
                src={comic.panels[0].imageUrl}
                alt="Comic cover preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <div className="font-bangers text-stone-900 text-lg">
              {comic.title}
            </div>
            <p className="text-stone-600 font-comic text-xs line-clamp-2 mt-0.5">
              {comic.subtitle}
            </p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <span className="px-2 py-0.5 bg-yellow-300 text-stone-900 rounded font-bangers text-[11px] border border-stone-800">
                Tone: {comic.tone.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-bangers text-[11px] border border-stone-800">
                Style: {comic.artStyle.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 bg-stone-200 text-stone-800 rounded font-bangers text-[11px] border border-stone-800">
                {comic.panels.length} Panels
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReDownload}
            className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl comic-border comic-shadow font-bangers text-base flex items-center justify-center space-x-2 transition-all"
          >
            <Download className="w-5 h-5 text-yellow-300" />
            <span>DOWNLOAD PDF AGAIN</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-yellow-100 text-stone-900 rounded-xl comic-border comic-shadow-sm font-bangers text-base flex items-center justify-center space-x-2 transition-all"
          >
            <Printer className="w-5 h-5 text-stone-700" />
            <span>PRINT / PREVIEW</span>
          </button>

          <button
            type="button"
            onClick={onReturnToViewer}
            className="w-full sm:w-auto px-5 py-3.5 bg-amber-300 hover:bg-amber-200 text-stone-900 rounded-xl comic-border comic-shadow-sm font-bangers text-base flex items-center justify-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-stone-900" />
            <span>BACK TO VIEWER</span>
          </button>
        </div>

        {/* Secondary option */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onCreateNewComic}
            className="text-xs font-bangers text-stone-600 hover:text-red-600 uppercase tracking-wide underline underline-offset-4"
          >
            ✦ Or Start a New Comic Storyline ✦
          </button>
        </div>

      </div>
    </div>
  );
};
