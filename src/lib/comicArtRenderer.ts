import { ArtStyle, ComicPanel } from '../types/comic';

/**
 * Procedural Comic Art Canvas Renderer.
 * Generates rich, themed comic illustrations with stylized backgrounds,
 * silhouettes, atmospheric particle effects, Ben-Day dots, manga speed lines,
 * and high-contrast comic framing matching the user's chosen ArtStyle.
 */
export function generateProceduralComicArt(
  panel: Pick<ComicPanel, 'panelNumber' | 'title' | 'setting' | 'action' | 'soundEffect' | 'visualDescription' | 'moodColor' | 'cameraAngle'>,
  artStyle: ArtStyle,
  characterName: string
): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const { width, height } = canvas;
  const mood = panel.moodColor || '#3b82f6';

  // Base background palette by style
  let topColor = '#1e1b4b';
  let bottomColor = '#0f172a';
  let accentColor = '#f59e0b';
  let inkColor = '#18181b';

  switch (artStyle) {
    case 'classic-comic':
      topColor = '#e02424';
      bottomColor = '#1e40af';
      accentColor = '#facc15';
      break;
    case 'anime-manga':
      topColor = '#312e81';
      bottomColor = '#030712';
      accentColor = '#ec4899';
      break;
    case 'retro-popart':
      topColor = '#f59e0b';
      bottomColor = '#ef4444';
      accentColor = '#06b6d4';
      break;
    case 'dark-noir':
      topColor = '#1f2937';
      bottomColor = '#030712';
      accentColor = '#9ca3af';
      inkColor = '#000000';
      break;
    case 'cyberpunk':
      topColor = '#4c1d95';
      bottomColor = '#020617';
      accentColor = '#06b6d4';
      break;
    case 'chibi-cartoon':
      topColor = '#60a5fa';
      bottomColor = '#34d399';
      accentColor = '#f472b6';
      break;
    case 'watercolor-fantasy':
      topColor = '#7c3aed';
      bottomColor = '#10b981';
      accentColor = '#fde047';
      break;
  }

  // 1. Sky / Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, topColor);
  bgGrad.addColorStop(0.6, mood);
  bgGrad.addColorStop(1, bottomColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ben-Day Dots or Manga Speed Lines
  if (artStyle === 'classic-comic' || artStyle === 'retro-popart') {
    // Halftone dots pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    const dotSpacing = 24;
    for (let x = 0; x < width; x += dotSpacing) {
      for (let y = 0; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (artStyle === 'anime-manga') {
    // Dynamic Manga Radial Action Speed Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    const centerX = width / 2;
    const centerY = height / 2;
    for (let i = 0; i < 40; i++) {
      const angle = (i / 40) * Math.PI * 2;
      const startDist = 180 + (i % 5) * 20;
      const x1 = centerX + Math.cos(angle) * startDist;
      const y1 = centerY + Math.sin(angle) * startDist;
      const x2 = centerX + Math.cos(angle) * 700;
      const y2 = centerY + Math.sin(angle) * 700;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  } else if (artStyle === 'cyberpunk') {
    // Cyberpunk grid horizon
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    const horizonY = height * 0.65;
    for (let y = horizonY; y < height; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let x = -200; x < width + 200; x += 60) {
      ctx.beginPath();
      ctx.moveTo(width / 2, horizonY);
      ctx.lineTo(x * 1.5, height);
      ctx.stroke();
    }
  }

  // 3. Environmental Scenery / Setting Silhouette
  ctx.fillStyle = inkColor;
  ctx.beginPath();
  const settingLower = (panel.setting || '').toLowerCase();
  
  if (settingLower.includes('forest') || settingLower.includes('woods') || settingLower.includes('tree') || settingLower.includes('enchanted')) {
    // Trees & mystical forest silhouette
    ctx.moveTo(0, height);
    ctx.lineTo(0, height * 0.7);
    for (let x = 0; x <= width; x += 40) {
      const treePeak = height * 0.45 + Math.sin(x * 0.05) * 80 + (x % 3 === 0 ? -50 : 20);
      ctx.lineTo(x - 20, height * 0.72);
      ctx.lineTo(x, treePeak);
      ctx.lineTo(x + 20, height * 0.72);
    }
    ctx.lineTo(width, height * 0.7);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Fireflies / Mystical orbs
    for (let i = 0; i < 15; i++) {
      const ox = (i * 57) % width;
      const oy = 150 + ((i * 73) % 400);
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(ox, oy, 3 + (i % 4), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(ox, oy, 8 + (i % 4), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (settingLower.includes('city') || settingLower.includes('urban') || settingLower.includes('street') || settingLower.includes('cyber') || settingLower.includes('tokyo')) {
    // City skyline silhouette with glowing windows
    ctx.moveTo(0, height);
    for (let x = 0; x < width; x += 70) {
      const bHeight = 250 + ((x * 13) % 300);
      ctx.lineTo(x, height - bHeight);
      ctx.lineTo(x + 60, height - bHeight);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Windows
    ctx.fillStyle = accentColor;
    for (let x = 10; x < width; x += 70) {
      const bHeight = 250 + ((x * 13) % 300);
      for (let wy = height - bHeight + 40; wy < height - 50; wy += 35) {
        if ((x + wy) % 2 === 0) {
          ctx.fillRect(x + 10, wy, 15, 20);
          ctx.fillRect(x + 35, wy, 15, 20);
        }
      }
    }
  } else {
    // Dramatic mountain/landscape horizon
    ctx.moveTo(0, height);
    ctx.lineTo(0, height * 0.65);
    ctx.lineTo(width * 0.25, height * 0.4);
    ctx.lineTo(width * 0.5, height * 0.6);
    ctx.lineTo(width * 0.75, height * 0.35);
    ctx.lineTo(width, height * 0.55);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
  }

  // 4. Dramatic Character Silhouette / Hero Pose
  ctx.save();
  ctx.translate(width / 2, height * 0.72);
  
  // Heroic cape or dynamic aura
  ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.beginPath();
  ctx.arc(0, -60, 110, 0, Math.PI * 2);
  ctx.fill();

  // Character body silhouette
  ctx.fillStyle = '#111827';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;

  // Head
  ctx.beginPath();
  ctx.arc(0, -120, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ears or Hair (If fox or hero)
  if (characterName.toLowerCase().includes('fox')) {
    // Fox ears!
    ctx.beginPath();
    ctx.moveTo(-25, -135);
    ctx.lineTo(-40, -180);
    ctx.lineTo(-10, -150);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(25, -135);
    ctx.lineTo(40, -180);
    ctx.lineTo(10, -150);
    ctx.fill();
    ctx.stroke();

    // Fox tail
    ctx.beginPath();
    ctx.moveTo(40, -20);
    ctx.bezierCurveTo(120, -50, 150, 40, 70, 70);
    ctx.bezierCurveTo(40, 50, 30, 10, 40, -20);
    ctx.fill();
    ctx.stroke();
  }

  // Torso
  ctx.beginPath();
  ctx.moveTo(-35, -85);
  ctx.lineTo(35, -85);
  ctx.lineTo(45, 20);
  ctx.lineTo(-45, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Action pose arms
  ctx.beginPath();
  ctx.moveTo(-35, -70);
  ctx.lineTo(-75, -100);
  ctx.lineTo(-100, -70);
  ctx.lineTo(-75, -50);
  ctx.lineTo(-35, -50);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(35, -70);
  ctx.lineTo(85, -40);
  ctx.lineTo(75, 10);
  ctx.lineTo(40, -10);
  ctx.fill();
  ctx.stroke();

  // Cape flap
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(-30, -75);
  ctx.bezierCurveTo(-110, -30, -130, 40, -80, 80);
  ctx.lineTo(-20, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // 5. Comic Sound Effect Burst Graphic ("POW!", "WHOOSH!", "RUMBLE!")
  if (panel.soundEffect) {
    ctx.save();
    ctx.translate(width * 0.78, height * 0.26);
    ctx.rotate(0.12);

    // Starburst background
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    const spikes = 12;
    const outerRadius = 85;
    const innerRadius = 45;
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i / (spikes * 2)) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sound effect text
    ctx.fillStyle = '#dc2626';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.font = '900 32px Bangers, Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeText(panel.soundEffect.toUpperCase(), 0, 2);
    ctx.fillText(panel.soundEffect.toUpperCase(), 0, 2);

    ctx.restore();
  }

  // 6. Camera Angle / Panel Title Ribbon (Top-Left)
  ctx.fillStyle = 'rgba(24, 24, 27, 0.88)';
  ctx.fillRect(20, 20, 220, 36);
  ctx.fillStyle = '#facc15';
  ctx.font = '700 15px Plus Jakarta Sans, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`PANEL #${panel.panelNumber} • ${panel.cameraAngle || 'SHOT'}`, 32, 38);

  // 7. Bold Comic Panel Border
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 14;
  ctx.strokeRect(0, 0, width, height);

  return canvas.toDataURL('image/png');
}
