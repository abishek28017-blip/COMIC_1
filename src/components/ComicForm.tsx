import React, { useState } from 'react';
import { Sparkles, Wand2, Palette, Smile, Flame, Shield, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { ArtStyle, GenerationRequest, Tone } from '../types/comic';

interface ComicFormProps {
  onSubmit: (request: GenerationRequest) => void;
  isLoading: boolean;
  loadingStep: string;
  initialValues?: Partial<GenerationRequest>;
}

export const ComicForm: React.FC<ComicFormProps> = ({
  onSubmit,
  isLoading,
  loadingStep,
  initialValues,
}) => {
  const [prompt, setPrompt] = useState(
    initialValues?.prompt || 'A brave fox exploring an enchanted forest, searching for a legendary glowing crystal guarded by ancient vines.'
  );
  const [characterName, setCharacterName] = useState(
    initialValues?.characterName || 'Todd the Fox'
  );
  const [setting, setSetting] = useState(
    initialValues?.setting || 'Whispering Emerald Forest'
  );
  const [tone, setTone] = useState<Tone>(
    initialValues?.tone || 'dramatic'
  );
  const [artStyle, setArtStyle] = useState<ArtStyle>(
    initialValues?.artStyle || 'anime-manga'
  );
  const [panelCount, setPanelCount] = useState<number>(
    initialValues?.panelCount || 4
  );

  const toneOptions: Array<{ id: Tone; label: string; icon: string; desc: string }> = [
    { id: 'funny', label: 'Funny / Slapstick', icon: '😂', desc: 'Light-hearted banter, hilarious mishaps, and lucky comedic twists' },
    { id: 'dramatic', label: 'Dramatic / Epic', icon: '⚔️', desc: 'High stakes, courageous trials, and intense emotional resonance' },
    { id: 'action', label: 'Action-Packed', icon: '💥', desc: 'Dynamic superhero showdowns, explosive martial arts, and kinetic energy' },
    { id: 'mysterious', label: 'Mysterious / Noir', icon: '🕵️', desc: 'Shadowy clues, suspenseful revelations, and gritty street tension' },
    { id: 'whimsical', label: 'Whimsical / Fantasy', icon: '✨', desc: 'Gentle fairytale magic, heartwarming friendships, and wondrous discovery' },
    { id: 'scifi', label: 'Sci-Fi / Cyber', icon: '🚀', desc: 'Futuristic technology, neon cybernetics, and cosmic wonder' },
  ];

  const artStyleOptions: Array<{ id: ArtStyle; label: string; badge: string; sampleColor: string; desc: string }> = [
    { id: 'classic-comic', label: 'Classic Comic Book', badge: '1970s Marvel/DC', sampleColor: 'bg-red-500', desc: 'Bold black ink outlines, Ben-Day halftone dots, primary colors' },
    { id: 'anime-manga', label: 'Anime & Manga', badge: 'Shonen / Seinen', sampleColor: 'bg-purple-600', desc: 'Dynamic angle speed lines, expressive eyes, sleek modern line work' },
    { id: 'retro-popart', label: '1960s Pop Art', badge: 'Lichtenstein', sampleColor: 'bg-amber-400', desc: 'Heavy halftone screen dots, bold speech bubbles, retro pop aesthetic' },
    { id: 'dark-noir', label: 'Dark Graphic Novel', badge: 'Sin City / Noir', sampleColor: 'bg-stone-800', desc: 'Stark chiaroscuro, heavy brooding shadows, rain-slicked city streets' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', badge: 'Neo-Tokyo 2099', sampleColor: 'bg-cyan-500', desc: 'Glowing neon cyan/magenta, rainy dystopian alleyways, cyber visor details' },
    { id: 'chibi-cartoon', label: 'Chibi & Sunday Strips', badge: 'Playful Toon', sampleColor: 'bg-pink-400', desc: 'Cute bouncy proportions, bright warm pastels, lively newspaper comic feel' },
    { id: 'watercolor-fantasy', label: 'Watercolor Storybook', badge: 'Painterly', sampleColor: 'bg-emerald-500', desc: 'Soft luminous washes, organic textures, enchanted storybook mood' },
  ];

  const quickPrompts = [
    {
      title: '🦊 Scenario 1: Forest Fox',
      prompt: 'A brave fox exploring an enchanted forest, seeking a legendary crystal shard.',
      name: 'Todd the Fox',
      setting: 'Whispering Emerald Forest',
      tone: 'dramatic' as Tone,
      style: 'anime-manga' as ArtStyle,
    },
    {
      title: '🕵️ Scenario 2: Clumsy Detective',
      prompt: 'A funny detective who accidentally solves city crimes by tripping and crashing into the mob boss.',
      name: 'Barnaby Fink',
      setting: 'Downtown Belltower',
      tone: 'funny' as Tone,
      style: 'classic-comic' as ArtStyle,
    },
    {
      title: '🚀 Cyberpunk Hacker Cat',
      prompt: 'A cybernetic cat sneaking through the glowing mainframe tower of Neo-Tokyo to liberate digital fish.',
      name: 'Pixel',
      setting: 'Neo-Tokyo Sub-Level 9',
      tone: 'action' as Tone,
      style: 'cyberpunk' as ArtStyle,
    },
    {
      title: '⚡ Reluctant Superhero',
      prompt: 'An ordinary barista who discovers their coffee machine brews espresso that grants lightning powers.',
      name: 'Maya Stone',
      setting: 'Sunburst Café, Metropolis',
      tone: 'funny' as Tone,
      style: 'classic-comic' as ArtStyle,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !characterName.trim()) return;

    onSubmit({
      prompt,
      characterName,
      setting,
      tone,
      artStyle,
      panelCount,
    });
  };

  const applyPreset = (preset: typeof quickPrompts[0]) => {
    setPrompt(preset.prompt);
    setCharacterName(preset.name);
    setSetting(preset.setting);
    setTone(preset.tone);
    setArtStyle(preset.style);
  };

  return (
    <div className="bg-white rounded-2xl comic-border-thick comic-shadow-xl p-6 sm:p-8 max-w-4xl mx-auto my-6">
      
      {/* Title & Tagline */}
      <div className="text-center mb-8">
        <div className="inline-block px-4 py-1 bg-yellow-300 comic-border rounded-full text-xs font-bangers text-stone-900 tracking-wider mb-2 -rotate-1">
          ✦ AI CREATIVE PIPELINE • GEMINI 3.8 & DIFFUSERS ✦
        </div>
        <h2 className="text-3xl sm:text-5xl font-bangers text-stone-900 tracking-wide uppercase drop-shadow-[2px_2px_0px_#fde047]">
          Create Your Comic Book
        </h2>
        <p className="text-stone-600 font-comic text-sm sm:text-base max-w-xl mx-auto mt-1">
          Provide your story premise, hero, and preferred aesthetic. ComicCraft will generate the panel-by-panel script, dialogue, and vivid comic illustrations!
        </p>
      </div>

      {/* Quick Starter Inspiration Pills */}
      <div className="mb-6">
        <label className="block text-xs font-bangers tracking-wider text-stone-700 uppercase mb-2">
          ⚡ Quick Story Sparks & Scenarios:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(q)}
              className="text-left p-2.5 rounded-xl border-2 border-stone-800 bg-amber-50 hover:bg-yellow-200 transition-colors text-xs font-bold text-stone-900 group"
            >
              <div className="font-bangers text-sm text-red-600 group-hover:text-stone-900">
                {q.title}
              </div>
              <div className="text-stone-600 text-[11px] truncate font-sans-clean mt-0.5">
                {q.name} • {q.tone}
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Story Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-bangers tracking-wide text-stone-900 flex items-center space-x-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>1. Story Premise & Plot Outline</span>
            </label>
            <span className="text-[11px] text-stone-500 font-sans-clean">
              Be as specific or whimsical as you like
            </span>
          </div>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what happens in your comic (e.g. A brave fox exploring an enchanted forest...)"
            required
            className="w-full px-4 py-3 bg-amber-50/50 rounded-xl comic-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-comic text-stone-900 text-sm sm:text-base resize-none"
          />
        </div>

        {/* Character & Setting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bangers tracking-wide text-stone-900 uppercase mb-1.5">
              👤 Main Character Name
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="e.g. Todd the Fox, Barnaby Fink"
              required
              className="w-full px-4 py-2.5 bg-amber-50/50 rounded-xl comic-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-comic text-stone-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bangers tracking-wide text-stone-900 uppercase mb-1.5">
              🗺️ Setting / Location
            </label>
            <input
              type="text"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="e.g. Whispering Emerald Forest, Downtown Belltower"
              required
              className="w-full px-4 py-2.5 bg-amber-50/50 rounded-xl comic-border focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-comic text-stone-900 text-sm"
            />
          </div>
        </div>

        {/* Tone Selector (Scenario 2 feature) */}
        <div>
          <label className="block text-sm font-bangers tracking-wide text-stone-900 uppercase mb-2">
            🎭 2. Narrative Tone (Iterate & Customize Mood)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {toneOptions.map((t) => {
              const isSelected = tone === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                    isSelected
                      ? 'bg-amber-300 border-stone-900 comic-shadow-sm font-bold scale-[1.02]'
                      : 'bg-stone-50 border-stone-300 hover:border-stone-500 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{t.icon}</span>
                    <span className="font-bangers text-stone-900 text-sm">
                      {t.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-sans-clean mt-1 line-clamp-2 leading-tight">
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Art Style Selector */}
        <div>
          <label className="block text-sm font-bangers tracking-wide text-stone-900 uppercase mb-2">
            🎨 3. Comic Art Style & Inking Aesthetic
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {artStyleOptions.map((style) => {
              const isSelected = artStyle === style.id;
              return (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setArtStyle(style.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'bg-red-50 border-stone-900 comic-shadow-sm ring-2 ring-red-500 font-bold scale-[1.02]'
                      : 'bg-stone-50 border-stone-300 hover:border-stone-500 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bangers text-stone-900 text-sm">
                      {style.label}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200 text-stone-800">
                      {style.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 font-sans-clean line-clamp-2">
                    {style.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel Count */}
        <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-xl comic-border">
          <div>
            <div className="text-sm font-bangers text-stone-900 uppercase">
              Length of Comic Storyboard:
            </div>
            <div className="text-xs text-stone-600 font-sans-clean">
              Select number of sequential story panels to ink
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {[3, 4, 5, 6].map((count) => (
              <button
                type="button"
                key={count}
                onClick={() => setPanelCount(count)}
                className={`w-9 h-9 rounded-lg font-bangers text-base transition-all ${
                  panelCount === count
                    ? 'bg-red-600 text-white comic-border comic-shadow-sm scale-105'
                    : 'bg-white text-stone-800 border-2 border-stone-400 hover:border-stone-800'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Submit & Generate Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 bg-red-600 hover:bg-red-500 text-white rounded-xl comic-border-thick comic-shadow-lg font-bangers text-xl sm:text-2xl tracking-wider uppercase transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-60 disabled:transform-none flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <span>{loadingStep || 'CRAFTING YOUR COMIC...'}</span>
              </div>
            ) : (
              <>
                <Wand2 className="w-6 h-6 text-yellow-300" />
                <span>KAPOW! GENERATE COMIC STRIP</span>
                <ArrowRight className="w-6 h-6 text-yellow-300" />
              </>
            )}
          </button>

          {/* Loading status details */}
          {isLoading && (
            <div className="mt-4 p-4 bg-yellow-100 rounded-xl comic-border text-center">
              <div className="font-bangers text-stone-900 text-base mb-1">
                ⚡ COMICCRAFT CREATIVE ENGINE RUNNING ⚡
              </div>
              <p className="text-xs text-stone-700 font-comic">
                Calling Gemini 3.8 Flash for storyline & dialogues, then generating visual illustrations for each panel.
              </p>
            </div>
          )}
        </div>

      </form>
    </div>
  );
};
