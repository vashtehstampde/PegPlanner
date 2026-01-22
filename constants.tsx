
import { BoardSize, ItemTemplate } from './types';

export const GRID_SIZE = 32; // Pixels per hole
export const HOLE_RADIUS = 3;

export const BOARD_SIZES: BoardSize[] = [
  { id: '24x24', label: '24" x 24"', width: 24, height: 24 },
  { id: '24x48', label: '24" x 48"', width: 48, height: 24 },
  { id: '48x48', label: '48" x 48"', width: 48, height: 48 },
  { id: '36x24', label: '36" x 24"', width: 36, height: 24 },
];

export const BOARD_COLORS = [
  { id: 'white', bg: '#fdfdfd', hole: '#cbd5e1', label: 'Classic White' },
  { id: 'brown', bg: '#5d4037', hole: '#3e2723', label: 'Hardboard Brown' },
  { id: 'gray', bg: '#334155', hole: '#1e293b', label: 'Modern Gray' },
  { id: 'black', bg: '#0f172a', hole: '#000000', label: 'Stealth Black' },
  { id: 'blue', bg: '#1e40af', hole: '#172554', label: 'Pro Blue' },
  { id: 'red', bg: '#991b1b', hole: '#450a0a', label: 'Toolbox Red' },
  { id: 'green', bg: '#065f46', hole: '#022c22', label: 'Shop Green' },
  { id: 'yellow', bg: '#ca8a04', hole: '#713f12', label: 'Safety Yellow' },
];

export interface BoardTexture {
  id: string;
  label: string;
  css: string;
  blendMode: string;
  opacity: number;
}

export const BOARD_TEXTURES: BoardTexture[] = [
  { 
    id: 'plain', 
    label: 'Smooth', 
    css: 'none', 
    blendMode: 'normal', 
    opacity: 0 
  },
  { 
    id: 'wood', 
    label: 'Wood Grain', 
    css: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 60px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 20px), linear-gradient(to right, rgba(0,0,0,0.02), rgba(0,0,0,0.05))', 
    blendMode: 'multiply', 
    opacity: 0.6 
  },
  { 
    id: 'hardboard', 
    label: 'Pressboard', 
    css: 'radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)', 
    blendMode: 'multiply', 
    opacity: 0.3 
  },
  { 
    id: 'painted', 
    label: 'Painted', 
    css: 'linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.05) 75%, transparent 75%, transparent)', 
    blendMode: 'soft-light', 
    opacity: 0.5 
  },
  { 
    id: 'brushed', 
    label: 'Brushed Metal', 
    css: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 4px)', 
    blendMode: 'overlay', 
    opacity: 0.3 
  }
];

export const ITEM_TEMPLATES: ItemTemplate[] = [
  // Hooks
  { id: 'hook-single', name: 'J-Hook', category: 'hooks', width: 1, height: 2, color: '#cbd5e1', icon: 'hook', pegs: [0] },
  { id: 'hook-double', name: 'Double Hook', category: 'hooks', width: 2, height: 2, color: '#cbd5e1', icon: 'hook-double', pegs: [0, 1] },
  { id: 'hook-long', name: 'Straight Hook', category: 'hooks', width: 1, height: 4, color: '#cbd5e1', icon: 'hook-long', pegs: [0] },
  { id: 'hook-loop', name: 'Loop Hook', category: 'hooks', width: 2, height: 2, color: '#cbd5e1', icon: 'loop', pegs: [0, 1] },
  { id: 'hook-pliers', name: 'Pliers Holder', category: 'hooks', width: 2, height: 2, color: '#cbd5e1', icon: 'pliers-holder', pegs: [0, 1] },
  { id: 'rack-screwdriver', name: 'Screwdriver Rack', category: 'hooks', width: 6, height: 2, color: '#cbd5e1', icon: 'screwdriver-rack', pegs: [0, 5] },
  { id: 'rack-multi', name: 'Multi-Tool Rack', category: 'hooks', width: 8, height: 2, color: '#cbd5e1', icon: 'multi-rack', pegs: [0, 7] },
  
  // Bins / Specialized
  { id: 'bin-small', name: 'Parts Bin', category: 'bins', width: 4, height: 4, color: '#ef4444', icon: 'bin', pegs: [0, 3] },
  { id: 'bin-large', name: 'Large Bin', category: 'bins', width: 8, height: 5, color: '#3b82f6', icon: 'bin', pegs: [0, 7] },
  { id: 'shelf', name: 'Utility Shelf', category: 'specialized', width: 12, height: 3, color: '#10b981', icon: 'shelf', pegs: [0, 11] },
  { id: 'mag-strip', name: 'Magnetic Strip', category: 'specialized', width: 10, height: 1, color: '#334155', icon: 'mag-strip', pegs: [0, 9] },
  { id: 'paper-towel', name: 'Towel Holder', category: 'specialized', width: 12, height: 4, color: '#cbd5e1', icon: 'paper-towel', pegs: [0, 11] },
  { id: 'cord-organizer', name: 'Cord Wrap', category: 'specialized', width: 3, height: 3, color: '#cbd5e1', icon: 'cord-wrap', pegs: [1] },

  // Tools
  { id: 'tool-hammer', name: 'Hammer', category: 'tools', width: 4, height: 12, color: '#475569', icon: 'hammer', pegs: [1, 2] },
  { id: 'tool-mallet', name: 'Rubber Mallet', category: 'tools', width: 4, height: 10, color: '#1e293b', icon: 'mallet', pegs: [1, 2] },
  { id: 'tool-screwdriver', name: 'Screwdriver', category: 'tools', width: 1, height: 4, color: '#475569', icon: 'screwdriver', pegs: [0] },
  { id: 'tool-wrench', name: 'Comb. Wrench', category: 'tools', width: 2, height: 7, color: '#475569', icon: 'wrench', pegs: [0] },
  { id: 'tool-adjwrench', name: 'Adjustable Wrench', category: 'tools', width: 2, height: 8, color: '#475569', icon: 'adj-wrench', pegs: [0] },
  { id: 'tool-drill', name: 'Power Drill', category: 'tools', width: 6, height: 8, color: '#475569', icon: 'drill', pegs: [2, 3] },
  { id: 'tool-saw', name: 'Hand Saw', category: 'tools', width: 16, height: 5, color: '#475569', icon: 'saw', pegs: [4, 12] },
  { id: 'tool-pliers', name: 'Pliers', category: 'tools', width: 3, height: 6, color: '#475569', icon: 'pliers', pegs: [1] },
  { id: 'tool-wirecutters', name: 'Wire Cutters', category: 'tools', width: 3, height: 6, color: '#475569', icon: 'wire-cutters', pegs: [1] },
  { id: 'tool-level', name: 'Torpedo Level', category: 'tools', width: 8, height: 2, color: '#facc15', icon: 'level', pegs: [0, 7] },
  { id: 'tool-tape', name: 'Tape Measure', category: 'tools', width: 3, height: 3, color: '#facc15', icon: 'tape-measure', pegs: [1] },
  { id: 'tool-utility', name: 'Utility Knife', category: 'tools', width: 1, height: 5, color: '#ef4444', icon: 'utility-knife', pegs: [0] },
  { id: 'tool-square', name: 'Framing Square', category: 'tools', width: 12, height: 8, color: '#94a3b8', icon: 'square', pegs: [0, 11] },

  // Props
  { id: 'prop-pistol', name: 'Handgun Prop', category: 'props', width: 6, height: 4, color: '#334155', icon: 'prop-pistol', pegs: [2, 5] },
  { id: 'prop-rifle', name: 'Assault Rifle', category: 'props', width: 18, height: 6, color: '#1e293b', icon: 'prop-rifle', pegs: [4, 14] },
  { id: 'prop-shotgun', name: 'Tactical Shotgun', category: 'props', width: 20, height: 4, color: '#1e293b', icon: 'prop-shotgun', pegs: [4, 16] },
  { id: 'prop-dagger', name: 'Combat Dagger', category: 'props', width: 2, height: 8, color: '#475569', icon: 'prop-dagger', pegs: [0, 1] },
  { id: 'prop-bowie', name: 'Bowie Knife', category: 'props', width: 3, height: 10, color: '#475569', icon: 'prop-bowie', pegs: [1] },
  { id: 'prop-katana', name: 'Katana Prop', category: 'props', width: 2, height: 24, color: '#1e293b', icon: 'prop-katana', pegs: [0] },
  { id: 'prop-needler', name: 'Type-33 Needler', category: 'props', width: 12, height: 10, color: '#5b21b6', icon: 'prop-needler', pegs: [2, 9] },
];
