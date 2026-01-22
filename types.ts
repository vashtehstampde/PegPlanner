
export type Category = 'hooks' | 'bins' | 'tools' | 'specialized' | 'props';

export interface ItemTemplate {
  id: string;
  name: string;
  category: Category;
  width: number; // in grid units
  height: number; // in grid units
  color: string;
  icon: string; // Type of tool icon to display
  pegs?: number[]; // indices of columns where pegs exist (relative to width start)
}

export interface PlacedItem {
  id: string;
  templateId: string;
  x: number; // grid position
  y: number; // grid position
  rotation: number; // 0, 90, 180, 270
}

export interface BoardSize {
  id: string;
  label: string;
  width: number; // in grid units (e.g., 24 holes)
  height: number; // in grid units
}

export interface DragState {
  templateId: string | null;
  placedItemId: string | null;
  isDragging: boolean;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}
