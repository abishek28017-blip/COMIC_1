import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

// Initialize Google GenAI SDK with server-side User-Agent telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  // ==========================================
  // API: System & Team Info
  // ==========================================
  app.get('/api/system/info', (_req, res) => {
    res.json({
      name: 'ComicCraft',
      version: '1.0.0',
      description: 'AI-Powered Personalized Comic Book Story & Illustration Studio',
      team: {
        teamLead: 'aravindhan',
        members: ['abishek kumar', 'rithika M', 'nilin jenilia'],
      },
      architecture: {
        storyModel: 'Gemini 3.8 Flash (Google GenAI SDK)',
        imageModel: 'Gemini Flash Image / Diffusers pipeline fallback',
        layoutBinding: 'ComicCraft Layout Builder Engine',
        exporter: 'FPDF & jsPDF Structured Exporter with timestamped deliverables',
        backend: 'Express Full-Stack / FastAPI Compatible API',
      },
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // ==========================================
  // API: Generate Comic Storyline & Panels
  // ==========================================
  app.post('/api/comic/generate-story', async (req, res) => {
    try {
      const {
        prompt = 'A brave fox exploring an enchanted forest',
        characterName = 'Todd the Fox',
        setting = 'Enchanted Forest',
        tone = 'dramatic',
        artStyle = 'anime-manga',
        panelCount = 4,
      } = req.body;

      // Build tailored instructions based on Tone & Art Style (Scenario 1 & 2)
      let toneGuidelines = '';
      if (tone === 'funny') {
        toneGuidelines = 'Focus on humor, comedic mishaps, clumsy timing, hilarious witty banter, slapstick reactions, and unexpected lucky twists.';
      } else if (tone === 'dramatic') {
        toneGuidelines = 'Focus on high emotional stakes, mysterious ancient secrets, courageous tests, dramatic tensions, and awe-inspiring confrontations.';
      } else if (tone === 'action') {
        toneGuidelines = 'Focus on explosive showdowns, kinetic martial/superhero moves, high-speed chases, and punchy cliffhangers.';
      } else if (tone === 'mysterious' || tone === 'noir') {
        toneGuidelines = 'Focus on shadowed clues, brooding inner monologues, cryptic whispers, and tension that builds toward a shocking revelation.';
      } else {
        toneGuidelines = 'Focus on rich worldbuilding, wonder, heroic adventure, and heartwarming camaraderie.';
      }

      const systemInstruction = `You are a legendary comic book writer and visual storyboard director at ComicCraft Studios.
You write engaging, punchy, visually dynamic comic book storylines structured panel by panel.
Every panel must have:
1. A descriptive title and camera angle (e.g., "Cinematic Wide Pan", "Low-Angle Hero Shot", "Intense Close-Up", "Explosive Dutch Angle").
2. A compelling narrator box (narration).
3. 1 to 2 sharp dialogues with clear character attribution and bubble type ('speech', 'shout', 'thought', or 'whisper').
4. A comic sound effect (SFX) word (e.g., 'POW!', 'WHOOSH!', 'CRASH!', 'KABOOM!', 'ZAP!', 'THUMP!', 'GULP!').
5. A detailed visual description specifically tailored for comic book artists in ${artStyle} art style.
6. A primary mood hex color matching the scene atmosphere.

Tone: ${tone}.
Tone instruction: ${toneGuidelines}
Art Style: ${artStyle}.
Total Panels: ${panelCount}.`;

      const userMessage = `Create a ${panelCount}-panel comic strip.
Story Prompt: "${prompt}"
Main Character Name: "${characterName}"
Setting: "${setting}"
Tone: "${tone}"
Art Style: "${artStyle}"

Make sure each panel flows seamlessly like a published comic strip or manga chapter!`;

      let parsedData: any = null;

      try {
        // Call Gemini 3.8 Flash with structured JSON responseSchema
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userMessage,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Catchy comic issue title' },
                subtitle: { type: Type.STRING, description: 'One-line teaser or tagline' },
                characterDescription: { type: Type.STRING, description: 'Visual appearance description of the main character' },
                panels: {
                  type: Type.ARRAY,
                  description: 'Panel-by-panel comic breakdown',
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      panelNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      setting: { type: Type.STRING },
                      action: { type: Type.STRING },
                      charactersPresent: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      narration: { type: Type.STRING, description: 'Narrator caption box text' },
                      dialogues: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            speaker: { type: Type.STRING },
                            text: { type: Type.STRING },
                            type: { type: Type.STRING, description: 'speech, shout, thought, or whisper' },
                          },
                          required: ['speaker', 'text', 'type'],
                        },
                      },
                      soundEffect: { type: Type.STRING, description: 'Onomatopoeia sound effect' },
                      visualDescription: { type: Type.STRING, description: 'Detailed prompt for comic illustrator' },
                      moodColor: { type: Type.STRING, description: 'Hex color code for atmospheric mood' },
                      cameraAngle: { type: Type.STRING },
                    },
                    required: [
                      'panelNumber',
                      'title',
                      'setting',
                      'action',
                      'charactersPresent',
                      'narration',
                      'dialogues',
                      'visualDescription',
                      'cameraAngle',
                    ],
                  },
                },
              },
              required: ['title', 'subtitle', 'characterDescription', 'panels'],
            },
          },
        });

        const responseText = response.text || '';
        parsedData = JSON.parse(responseText);
      } catch (geminiErr: any) {
        console.warn('Gemini generateContent error or 503, using resilient story generator:', geminiErr.message);
        
        // Intelligent dynamic procedural comic storyline fallback
        const isFunny = tone === 'funny';
        const isDramatic = tone === 'dramatic';
        const sfxList = isFunny 
          ? ['THUMP!', 'WHOOPS!', 'CRASH-BAM!', 'TA-DA!']
          : ['RUSTLE...', 'CHIME!', 'KRA-BOOM!', 'SHINEEE!'];

        const fallbackPanels = [];
        for (let i = 1; i <= panelCount; i++) {
          let pTitle = `Chapter ${i}: The Journey Begins`;
          let pAction = `${characterName} assesses the unfamiliar territory of ${setting}.`;
          let pNarr = isFunny 
            ? `Nobody ever accused ${characterName} of taking the easy path... or reading the instruction manual.`
            : `Deep within ${setting}, the whispers of destiny called upon ${characterName}.`;
          let pDiagText = isFunny
            ? (i === 1 ? `Everything is under complete control! Probably.` : i === 2 ? `WHOAAA! That wasn't in the brochure!` : `Aha! Perfectly planned!`)
            : (i === 1 ? `The path ahead is fraught with shadows, but I will not falter.` : i === 2 ? `The ancient artifact... its pulse is quickening!` : `Together, we restore the light.`);

          if (i === 1) {
            pTitle = `Arrival at ${setting}`;
          } else if (i === 2) {
            pTitle = isFunny ? 'A Slight Miscalculation' : 'The Hidden Beacon';
            pAction = isFunny ? `${characterName} accidentally trips over a mysterious lever.` : `${characterName} uncovers an ancient celestial relic.`;
          } else if (i === panelCount) {
            pTitle = isFunny ? 'The Accidental Victory' : 'A Hero Triumphant';
            pAction = `${characterName} stands victorious in ${setting}.`;
          }

          fallbackPanels.push({
            panelNumber: i,
            title: pTitle,
            setting,
            action: pAction,
            charactersPresent: [characterName],
            narration: pNarr,
            dialogues: [
              {
                speaker: characterName,
                text: pDiagText,
                type: isFunny && i === 2 ? 'shout' : 'speech',
              },
            ],
            soundEffect: sfxList[(i - 1) % sfxList.length],
            visualDescription: `${artStyle} comic panel showing ${characterName} in ${setting}. ${pAction}`,
            moodColor: isDramatic ? '#0f766e' : isFunny ? '#d97706' : '#2563eb',
            cameraAngle: i === 1 ? 'Cinematic Establishing Shot' : i === 2 ? 'Dynamic Low Angle' : 'Heroic Wide Shot',
          });
        }

        parsedData = {
          title: `${characterName}: ${isFunny ? 'The Chaotic Chronicle' : 'The Legend of ' + setting}`,
          subtitle: `A ${tone} ${artStyle} comic adventure in ${setting}`,
          characterDescription: `${characterName}, an adventurous soul ready for any challenge in ${setting}.`,
          panels: fallbackPanels,
        };
      }

      // Normalize dialogues with unique IDs
      const normalizedPanels = (parsedData.panels || []).map((panel: any, idx: number) => ({
        ...panel,
        panelNumber: panel.panelNumber || idx + 1,
        soundEffect: panel.soundEffect || (idx === 0 ? 'WHOOSH!' : idx === 1 ? 'CLANG!' : idx === 2 ? 'KABOOM!' : 'TA-DA!'),
        moodColor: panel.moodColor || '#2563eb',
        dialogues: (panel.dialogues || []).map((d: any, dIdx: number) => ({
          id: `d_${idx + 1}_${dIdx + 1}`,
          speaker: d.speaker || characterName,
          text: d.text || '...',
          type: ['speech', 'shout', 'thought', 'whisper'].includes(d.type) ? d.type : 'speech',
        })),
      }));

      res.json({
        success: true,
        story: {
          id: `comic_${Date.now()}`,
          title: parsedData.title || `${characterName}'s Adventure`,
          subtitle: parsedData.subtitle || `A ${tone} adventure in ${setting}`,
          prompt,
          characterName,
          characterDescription: parsedData.characterDescription,
          setting,
          tone,
          artStyle,
          panels: normalizedPanels,
          createdAt: new Date().toISOString(),
          layout: 'grid-2x2',
        },
      });
    } catch (error: any) {
      console.error('Error generating comic story:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate story with Gemini AI',
      });
    }
  });

  // ==========================================
  // API: Generate Panel Illustration
  // ==========================================
  app.post('/api/comic/generate-panel-image', async (req, res) => {
    try {
      const {
        visualDescription,
        artStyle = 'classic-comic',
        characterName = 'Hero',
        panelNumber = 1,
      } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: false,
          fallback: true,
          message: 'No Gemini API key available; using styled canvas illustration',
        });
      }

      const styleKeywordMap: Record<string, string> = {
        'classic-comic': 'vintage comic book art style, bold black ink outlines, Ben-Day halftone dots, 1970s Marvel/DC comic strip, vibrant print colors',
        'anime-manga': 'vivid Japanese manga anime illustration, clean line art, expressive cinematic lighting, dynamic screentone shading',
        'retro-popart': '1960s pop art Roy Lichtenstein style, primary colors, heavy dots, graphic novel illustration',
        'dark-noir': 'dark graphic novel noir style, high contrast chiaroscuro, heavy black shadows, gritty urban rain, Frank Miller aesthetic',
        'cyberpunk': 'cyberpunk sci-fi graphic illustration, glowing neon cyan and magenta lights, rainy futuristic reflections, detailed cybernetic aesthetic',
        'chibi-cartoon': 'cute playful cartoon chibi illustration, bold bouncy lines, bright joyful colors, Sunday morning newspaper comics',
        'watercolor-fantasy': 'watercolor storybook fantasy illustration, whimsical painted textures, luminous magical atmosphere',
      };

      const styleKeywords = styleKeywordMap[artStyle] || styleKeywordMap['classic-comic'];
      const imagePrompt = `Comic book panel #${panelNumber}: ${visualDescription}. Featuring ${characterName}. Art style: ${styleKeywords}. High quality comic panel, graphic storytelling, no photorealism, no modern photography.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [{ text: imagePrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: '1:1',
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            return res.json({
              success: true,
              imageUrl: `data:${mime};base64,${part.inlineData.data}`,
            });
          }
        }
      } catch (geminiImgError: any) {
        console.warn('Gemini image generation warning:', geminiImgError.message);
        // Fall back gracefully to procedural renderer on client
        return res.json({
          success: false,
          fallback: true,
          error: geminiImgError.message,
        });
      }

      res.json({
        success: false,
        fallback: true,
      });
    } catch (error: any) {
      console.error('Error generating image:', error);
      res.json({
        success: false,
        fallback: true,
        error: error.message,
      });
    }
  });

  // ==========================================
  // Vite Dev Middleware or Static Production
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ComicCraft Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ComicCraft server:', err);
  process.exit(1);
});
