import { ComicStory } from '../types/comic';
import { generateProceduralComicArt } from './comicArtRenderer';

// Pre-generate sample comics with initial canvas artwork
export function createScenario1Comic(): ComicStory {
  const panels = [
    {
      panelNumber: 1,
      title: 'Threshold of the Unknown',
      setting: 'Whispering Emerald Forest Edge',
      action: 'Todd the Fox pauses at the misty ancient archway of glowing vines.',
      charactersPresent: ['Todd the Brave Fox'],
      narration: 'Beyond the safe border of Elderglen lay the Whispering Forest, a realm untouched by mortal paws for three hundred seasons.',
      dialogues: [
        {
          id: 'd1-1',
          speaker: 'Todd',
          text: 'The legends were true... the canopy breathes with ancient magic.',
          type: 'speech' as const,
        },
      ],
      soundEffect: 'RUSTLE',
      visualDescription: 'Todd the adventurous young fox with a crimson traveler cloak standing before giant luminescent trees in a mystical forest.',
      moodColor: '#064e3b',
      cameraAngle: 'Wide Cinematic Pan',
    },
    {
      panelNumber: 2,
      title: 'The Starlight Beacon',
      setting: 'Heart of the Mossy Grove',
      action: 'A floating crystal lotus reveals itself atop a ruined stone pedestal.',
      charactersPresent: ['Todd the Brave Fox'],
      narration: 'Deeper into the emerald twilight, a celestial resonance guided Todd toward the forgotten Spring of Aethelgard.',
      dialogues: [
        {
          id: 'd2-1',
          speaker: 'Todd',
          text: 'The Shard of Lumin... It was not destroyed after all!',
          type: 'thought' as const,
        },
      ],
      soundEffect: 'CHIME',
      visualDescription: 'Todd staring in awe as a floating azure crystal illuminates his amber eyes amidst spiraling fireflies.',
      moodColor: '#0284c7',
      cameraAngle: 'Over-The-Shoulder Low Angle',
    },
    {
      panelNumber: 3,
      title: 'Shadows Awaken',
      setting: 'The Hollow Canopy',
      action: 'A dark bramble serpent rises behind the mossy stones.',
      charactersPresent: ['Todd the Brave Fox', 'Bramble Sentinel'],
      narration: 'The sanctuary was never unguarded. The guardian of thorns had awaited a worthy soul to test.',
      dialogues: [
        {
          id: 'd3-1',
          speaker: 'Bramble Sentinel',
          text: 'WHO DARES DISTURB THE SLUMBER OF THE FIRST SEED?!',
          type: 'shout' as const,
        },
        {
          id: 'd3-2',
          speaker: 'Todd',
          text: 'I come seeking balance, not conquest!',
          type: 'speech' as const,
        },
      ],
      soundEffect: 'KRA-BOOM!',
      visualDescription: 'A towering creature made of twisted roots and glowing red eyes towering over the determined young fox.',
      moodColor: '#450a0a',
      cameraAngle: 'Dramatic Worms-Eye Perspective',
    },
    {
      panelNumber: 4,
      title: 'The Bond of Embers',
      setting: 'The Restored Glade',
      action: 'Todd reaches his paw out, resonating with the crystal and pacifying the guardian.',
      charactersPresent: ['Todd the Brave Fox', 'Bramble Sentinel'],
      narration: 'Courage is not the absence of fear, but the willingness to extend an open hand when shadows loom darkest.',
      dialogues: [
        {
          id: 'd4-1',
          speaker: 'Todd',
          text: 'Together, we protect the forest from the encroaching frost.',
          type: 'speech' as const,
        },
      ],
      soundEffect: 'SHINEEE!',
      visualDescription: 'Todd bathing in golden emerald radiance as the root guardian bows down in peaceful alliance.',
      moodColor: '#15803d',
      cameraAngle: 'High Angle Majestic Spread',
    },
  ];

  return {
    id: 'comic_scenario_1',
    title: 'Todd: The Brave Fox & The Enchanted Forest',
    subtitle: 'A dramatic fantasy journey into forgotten realms and celestial guardians.',
    prompt: 'A brave fox named Todd exploring an enchanted forest, discovering an ancient crystal shard while confronting the guardian of thorns.',
    characterName: 'Todd the Fox',
    characterDescription: 'A clever, agile crimson fox wearing a leaf-leather clasp cloak with radiant amber eyes.',
    setting: 'Whispering Emerald Forest',
    tone: 'dramatic',
    artStyle: 'anime-manga',
    layout: 'grid-2x2',
    createdAt: new Date().toISOString(),
    panels: panels.map((p) => ({
      ...p,
      imageUrl: generateProceduralComicArt(p, 'anime-manga', 'Todd the Fox'),
    })),
  };
}

export function createScenario2Comic(): ComicStory {
  const panels = [
    {
      panelNumber: 1,
      title: 'A Subtle Investigation',
      setting: 'The Dusty Office of Barnaby Fink, Private Eye',
      action: 'Barnaby trips over his own trenchcoat while trying to strike a suave detective pose.',
      charactersPresent: ['Barnaby Fink'],
      narration: 'They called me Barnaby. Master of deductions, whisperer of city alleys, and currently trapped inside my own sleeve lining.',
      dialogues: [
        {
          id: 'd1-1',
          speaker: 'Barnaby',
          text: 'Fear not, madam! The culprit left a calling card right by the... wait, that is my lunch receipt.',
          type: 'speech' as const,
        },
      ],
      soundEffect: 'THUMP!',
      visualDescription: 'A quirky, disheveled detective in a slightly oversized fedora tripping over an open filing cabinet full of donut boxes.',
      moodColor: '#b45309',
      cameraAngle: 'Awkward Mid Shot',
    },
    {
      panelNumber: 2,
      title: 'The Cat Burglar’s Lair',
      setting: 'Rooftops of Downtown Belltower',
      action: 'Barnaby slips on a stray banana peel on a wet skylight, flying through the air.',
      charactersPresent: ['Barnaby Fink'],
      narration: 'Following the trail of powdered sugar led directly to the penthouse. Stealth was my middle name.',
      dialogues: [
        {
          id: 'd2-1',
          speaker: 'Barnaby',
          text: 'WHOOOOAAAA! MY AGILITY IS TOTALLY INTENTIONAL!',
          type: 'shout' as const,
        },
      ],
      soundEffect: 'WHOOOOSH!',
      visualDescription: 'Barnaby soaring horizontally across the night sky, fedora flying off, wildly flapping his arms like a bird.',
      moodColor: '#1d4ed8',
      cameraAngle: 'Diagonal Comic Action Shot',
    },
    {
      panelNumber: 3,
      title: 'Precision Crash-Landing',
      setting: 'The Evil Henchmen Lounge',
      action: 'Barnaby crashes through the skylight, landing squarely on top of the notorious villain Boss Rumpus.',
      charactersPresent: ['Barnaby Fink', 'Boss Rumpus'],
      narration: 'Calculated trajectory. Down to the millimeter. At least, that is what I told the judge later.',
      dialogues: [
        {
          id: 'd3-1',
          speaker: 'Boss Rumpus',
          text: 'OOF! MY SCIATICA!',
          type: 'shout' as const,
        },
        {
          id: 'd3-2',
          speaker: 'Barnaby',
          text: 'Aha! Caught you right in the trap I had scheduled for 4:15 PM!',
          type: 'speech' as const,
        },
      ],
      soundEffect: 'CRASH-BAM!',
      visualDescription: 'Glass shattering everywhere as Barnaby lands directly in a giant bowl of punch on top of the stunned mob boss.',
      moodColor: '#b91c1c',
      cameraAngle: 'Explosive Center Panel',
    },
    {
      panelNumber: 4,
      title: 'The Medal of Accidental Honor',
      setting: 'City Hall Steps',
      action: 'The Mayor awards Barnaby the Golden Key to the City while Barnaby tries to shake out glass from his shoe.',
      charactersPresent: ['Barnaby Fink', 'The Mayor'],
      narration: 'Another case closed. Crime sleeps with one eye open, mostly terrified that I might trip into their living room.',
      dialogues: [
        {
          id: 'd4-1',
          speaker: 'The Mayor',
          text: 'His methods defy all human logic... but by golly, he gets results!',
          type: 'speech' as const,
        },
        {
          id: 'd4-2',
          speaker: 'Barnaby',
          text: 'Just doing my civic duty, Mayor. Also, my shoe is stuck to the podium.',
          type: 'speech' as const,
        },
      ],
      soundEffect: 'TA-DAAA!',
      visualDescription: 'Flashbulbs flashing as the clumsy detective holds a giant golden key upside down with a proud grin.',
      moodColor: '#eab308',
      cameraAngle: 'Classic Heroic Wide Shot',
    },
  ];

  return {
    id: 'comic_scenario_2',
    title: 'The Accidental Hero: Barnaby Strikes Again',
    subtitle: 'A slapstick classic comic adventure of luck, clumsy deductions, and pure chaos.',
    prompt: 'A funny comic strip about Barnaby Fink, a bumbling detective who accidentally solves city crimes by tripping and falling onto criminal bosses.',
    characterName: 'Barnaby Fink',
    characterDescription: 'A gangly detective in a rumpled brown trenchcoat and tilted fedora with an overly confident smirk.',
    setting: 'Downtown Belltower',
    tone: 'funny',
    artStyle: 'classic-comic',
    layout: 'grid-2x2',
    createdAt: new Date().toISOString(),
    panels: panels.map((p) => ({
      ...p,
      imageUrl: generateProceduralComicArt(p, 'classic-comic', 'Barnaby Fink'),
    })),
  };
}
