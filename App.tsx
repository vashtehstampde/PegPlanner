
import React, { useState, useCallback, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { 
  Plus, 
  Trash2, 
  Download, 
  Layout,
  Eraser,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Layers
} from 'lucide-react';
import { 
  BoardSize, 
  PlacedItem, 
  ItemTemplate, 
  DragState, 
  Category 
} from './types';
import { 
  BOARD_SIZES, 
  ITEM_TEMPLATES, 
  GRID_SIZE,
  BOARD_COLORS,
  BOARD_TEXTURES
} from './constants';
import { ItemIcon } from './components/ItemIcon';

const App: React.FC = () => {
  const [boardSize, setBoardSize] = useState<BoardSize>(BOARD_SIZES[0]);
  const [boardColorId, setBoardColorId] = useState(BOARD_COLORS[0].id);
  const [boardTextureId, setBoardTextureId] = useState(BOARD_TEXTURES[0].id);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('hooks');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    templateId: null,
    placedItemId: null,
    isDragging: false,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
  } as DragState);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const boardRef = useRef<HTMLDivElement>(null);

  const activeBoardColor = BOARD_COLORS.find(c => c.id === boardColorId) || BOARD_COLORS[0];
  const activeBoardTexture = BOARD_TEXTURES.find(t => t.id === boardTextureId) || BOARD_TEXTURES[0];

  useEffect(() => {
    const saved = localStorage.getItem('pegboard_layout_v5');
    if (saved) {
      try {
        const { size, items, colorId, textureId } = JSON.parse(saved);
        const board = BOARD_SIZES.find(b => b.id === size) || BOARD_SIZES[0];
        setBoardSize(board);
        setPlacedItems(items);
        if (colorId) setBoardColorId(colorId);
        if (textureId) setBoardTextureId(textureId);
      } catch (e) {
        console.error("Failed to load layout", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pegboard_layout_v5', JSON.stringify({
      size: boardSize.id,
      items: placedItems,
      colorId: boardColorId,
      textureId: boardTextureId
    }));
  }, [boardSize, placedItems, boardColorId, boardTextureId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItemId || dragState.isDragging) return;
      
      const item = placedItems.find(i => i.id === selectedItemId);
      if (!item) return;

      const template = ITEM_TEMPLATES.find(t => t.id === item.templateId)!;
      let newX = item.x;
      let newY = item.y;

      switch (e.key) {
        case 'ArrowLeft': newX -= 1; break;
        case 'ArrowRight': newX += 1; break;
        case 'ArrowUp': newY -= 1; break;
        case 'ArrowDown': newY += 1; break;
        case 'Delete':
        case 'Backspace':
          setPlacedItems(prev => prev.filter(i => i.id !== selectedItemId));
          setSelectedItemId(null);
          return;
        default: return;
      }

      if (newX >= 0 && newY >= 0 && newX + template.width <= boardSize.width && newY + template.height <= boardSize.height) {
        e.preventDefault();
        setPlacedItems(prev => prev.map(i => i.id === selectedItemId ? { ...i, x: newX, y: newY } : i));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, placedItems, boardSize, dragState.isDragging]);

  const handleDragStartFromSidebar = (templateId: string, e: React.MouseEvent) => {
    setDragState({
      templateId,
      placedItemId: null,
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: GRID_SIZE / 2,
      offsetY: GRID_SIZE / 2,
    });
    setSelectedItemId(null);
  };

  const handleDragStartExisting = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    setDragState({
      templateId: null,
      placedItemId: id,
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
    setSelectedItemId(id);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging || !boardRef.current) {
      setDragState(prev => ({ ...prev, isDragging: false }));
      return;
    }

    const rect = boardRef.current.getBoundingClientRect();
    const dropX = mousePos.x - rect.left - dragState.offsetX;
    const dropY = mousePos.y - rect.top - dragState.offsetY;
    
    const gridX = Math.round(dropX / GRID_SIZE);
    const gridY = Math.round(dropY / GRID_SIZE);

    const templateId = dragState.templateId || placedItems.find(i => i.id === dragState.placedItemId)?.templateId;
    if (!templateId) return;

    const template = ITEM_TEMPLATES.find(t => t.id === templateId)!;

    const isOutOfBounds = 
      gridX < 0 || 
      gridY < 0 || 
      gridX + template.width > boardSize.width || 
      gridY + template.height > boardSize.height;

    if (!isOutOfBounds) {
      if (dragState.templateId) {
        const newItemId = `item-${Date.now()}`;
        setPlacedItems(prev => [...prev, { id: newItemId, templateId: dragState.templateId!, x: gridX, y: gridY }]);
        setSelectedItemId(newItemId);
      } else if (dragState.placedItemId) {
        setPlacedItems(prev => prev.map(item => item.id === dragState.placedItemId ? { ...item, x: gridX, y: gridY } : item));
      }
    }

    setDragState({
      templateId: null,
      placedItemId: null,
      isDragging: false,
      startX: 0,
      startY: 0,
      offsetX: 0,
      offsetY: 0,
    });
  }, [dragState, mousePos, boardSize, placedItems]);

  useEffect(() => {
    if (dragState.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  const removeItem = (id: string) => {
    setPlacedItems(prev => prev.filter(item => item.id !== id));
    if (selectedItemId === id) setSelectedItemId(null);
  };

  const clearBoard = () => {
    if (confirm('Clear the entire board?')) {
      setPlacedItems([]);
      setSelectedItemId(null);
    }
  };

  const exportAsImage = async () => {
    if (!boardRef.current) return;
    const originalSelection = selectedItemId;
    setSelectedItemId(null);
    
    setTimeout(async () => {
      const canvas = await html2canvas(boardRef.current!, {
        backgroundColor: activeBoardColor.bg,
        scale: 2
      });
      const link = document.createElement('a');
      link.download = `pegboard-layout.png`;
      link.href = canvas.toDataURL();
      link.click();
      setSelectedItemId(originalSelection);
    }, 100);
  };

  const activeTemplate = dragState.templateId 
    ? ITEM_TEMPLATES.find(t => t.id === dragState.templateId)
    : ITEM_TEMPLATES.find(t => t.id === placedItems.find(i => i.id === dragState.placedItemId)?.templateId);

  let ghostX = 0;
  let ghostY = 0;
  let isGhostVisible = false;
  if (dragState.isDragging && boardRef.current && activeTemplate) {
    const rect = boardRef.current.getBoundingClientRect();
    const relativeX = mousePos.x - rect.left - dragState.offsetX;
    const relativeY = mousePos.y - rect.top - dragState.offsetY;
    
    ghostX = Math.round(relativeX / GRID_SIZE) * GRID_SIZE;
    ghostY = Math.round(relativeY / GRID_SIZE) * GRID_SIZE;

    const gridX = ghostX / GRID_SIZE;
    const gridY = ghostY / GRID_SIZE;
    if (gridX >= 0 && gridY >= 0 && gridX + activeTemplate.width <= boardSize.width && gridY + activeTemplate.height <= boardSize.height) {
      isGhostVisible = true;
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-200 text-slate-800" onClick={() => setSelectedItemId(null)}>
      <header className="h-auto md:h-20 border-b bg-white flex flex-col md:flex-row items-center justify-between px-6 py-2 z-20 shadow-sm gap-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Layout size={24} />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg leading-tight tracking-tight">PegPlanner Pro</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Precision Shop Layout</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">1. Dimensions</span>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
              {BOARD_SIZES.map(size => (
                <button
                  key={size.id}
                  onClick={() => setBoardSize(size)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                    boardSize.id === size.id 
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">2. Material Color</span>
            <div className="flex gap-1.5 flex-wrap max-w-[160px]">
              {BOARD_COLORS.map(color => (
                <button
                  key={color.id}
                  onClick={() => setBoardColorId(color.id)}
                  title={color.label}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    boardColorId === color.id ? 'border-indigo-500 scale-110 shadow-lg ring-1 ring-indigo-200' : 'border-white shadow-md hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.bg }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">3. Finish Texture</span>
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
              {BOARD_TEXTURES.map(texture => (
                <button
                  key={texture.id}
                  onClick={() => setBoardTextureId(texture.id)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                    boardTextureId === texture.id 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                  }`}
                >
                  {texture.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block" />

          <div className="flex items-center gap-3">
            <button onClick={clearBoard} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90 group" title="Wipe Board">
              <Eraser size={22} className="group-hover:-rotate-12 transition-transform" />
            </button>
            <button onClick={exportAsImage} className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-slate-900 transition-all active:translate-y-0.5 border-b-4 border-slate-950 hover:border-b-2">
              <Download size={18} />
              <span className="hidden sm:inline">Export Layout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r bg-white flex flex-col z-10 shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="p-4 bg-slate-50 border-b flex flex-wrap gap-1">
            {(['hooks', 'tools', 'bins', 'specialized'] as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-2 text-[10px] uppercase tracking-tighter font-black rounded-lg border-2 transition-all ${
                  activeCategory === cat ? 'bg-indigo-600 border-indigo-700 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50">
            <div className="grid grid-cols-2 gap-3">
              {ITEM_TEMPLATES.filter(t => t.category === activeCategory).map(template => (
                <div
                  key={template.id}
                  onMouseDown={(e) => handleDragStartFromSidebar(template.id, e)}
                  className="group relative bg-white border border-slate-200 rounded-xl p-3 cursor-grab hover:border-indigo-400 hover:shadow-xl transition-all active:cursor-grabbing select-none active:scale-95"
                >
                  <div className="h-24 flex items-center justify-center mb-2 bg-slate-100/50 rounded-lg overflow-hidden border border-slate-200/50 group-hover:bg-indigo-50/30 transition-colors">
                    <div className="scale-75 group-hover:scale-90 transition-transform">
                      <ItemIcon type={template.icon} color={template.category === 'hooks' ? '#94a3b8' : template.color} className="w-16 h-16 drop-shadow-sm" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] font-black text-slate-700 leading-tight mb-1">{template.name}</div>
                    <div className="inline-block px-2 py-0.5 bg-indigo-50 text-[9px] text-indigo-600 font-black rounded uppercase">
                      {template.width}" x {template.height}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-indigo-950 text-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <Info size={20} className="text-indigo-300" />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Workshop Tips</h4>
                <p className="text-[11px] leading-relaxed text-indigo-100/70 font-medium">
                  Mix and match colors and textures to find your perfect shop aesthetic. Press <strong className="text-white">DEL</strong> to remove selected items.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto bg-slate-200 p-20 flex items-center justify-center relative custom-scrollbar">
          <div 
            ref={boardRef}
            className="relative shadow-2xl transition-all duration-300 rounded-sm border-[12px] border-slate-800 ring-4 ring-slate-900/10 overflow-hidden"
            style={{
              width: boardSize.width * GRID_SIZE,
              height: boardSize.height * GRID_SIZE,
              backgroundColor: activeBoardColor.bg,
            }}
          >
            {/* Board Texture Layer */}
            {activeBoardTexture.id !== 'plain' && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: activeBoardTexture.css,
                  mixBlendMode: activeBoardTexture.blendMode as any,
                  opacity: activeBoardTexture.opacity,
                  backgroundSize: activeBoardTexture.id === 'wood' ? '120px 40px' : activeBoardTexture.id === 'hardboard' ? '8px 8px' : '32px 32px'
                }}
              />
            )}

            {/* Pegboard Holes */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                backgroundImage: `radial-gradient(circle at ${GRID_SIZE / 2}px ${GRID_SIZE / 2}px, ${activeBoardColor.hole} 3.5px, transparent 0px)`,
              }}
            />

            {isGhostVisible && activeTemplate && (
              <div 
                className="absolute pointer-events-none z-10 transition-all duration-75"
                style={{
                  left: ghostX,
                  top: ghostY,
                  width: activeTemplate.width * GRID_SIZE,
                  height: activeTemplate.height * GRID_SIZE,
                }}
              >
                <div className="w-full h-full border-2 border-dashed border-indigo-500 rounded bg-indigo-500/10 flex items-center justify-center opacity-40">
                  <ItemIcon type={activeTemplate.icon} color="white" className="w-4/5 h-4/5 translate-y-[-2px]" />
                </div>
              </div>
            )}

            {dragState.isDragging && activeTemplate && (
              <div 
                className="fixed pointer-events-none z-50 opacity-50 grayscale contrast-125"
                style={{
                  left: mousePos.x,
                  top: mousePos.y,
                  width: activeTemplate.width * GRID_SIZE,
                  height: activeTemplate.height * GRID_SIZE,
                  transform: `translate(-${dragState.offsetX}px, -${dragState.offsetY}px)`,
                }}
              >
                 <ItemIcon type={activeTemplate.icon} color={activeTemplate.color} className="w-full h-full drop-shadow-2xl translate-y-[-2px]" />
              </div>
            )}

            {placedItems.map(item => {
              const template = ITEM_TEMPLATES.find(t => t.id === item.templateId)!;
              const isBeingDragged = dragState.placedItemId === item.id;
              const isSelected = selectedItemId === item.id;
              
              return (
                <div
                  key={item.id}
                  onMouseDown={(e) => handleDragStartExisting(item.id, e)}
                  onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); }}
                  className={`absolute group cursor-grab active:cursor-grabbing transition-opacity ${
                    isBeingDragged ? 'opacity-0' : 'opacity-100 hover:z-20'
                  }`}
                  style={{
                    left: item.x * GRID_SIZE,
                    top: item.y * GRID_SIZE,
                    width: template.width * GRID_SIZE,
                    height: template.height * GRID_SIZE,
                  }}
                >
                  <div className={`w-full h-full relative transition-transform origin-top ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-transparent rounded-lg scale-[1.01]' : 'group-hover:scale-[1.005]'}`}>
                    
                    {template.pegs?.map((pegCol, idx) => (
                      <div 
                        key={idx}
                        className="absolute w-3 h-3 bg-slate-500 rounded-full border border-slate-700 shadow-inner z-20"
                        style={{ 
                          left: (pegCol + 0.5) * GRID_SIZE - 6,
                          top: 0.5 * GRID_SIZE - 6
                        }}
                      />
                    ))}
                    
                    <div className="w-full h-full">
                      <ItemIcon 
                        type={template.icon} 
                        color={template.category === 'hooks' ? '#cbd5e1' : template.color} 
                        className={`w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] ${template.category === 'hooks' ? 'opacity-90' : 'opacity-100'} translate-y-[-2px]`} 
                      />
                    </div>

                    {!dragState.isDragging && isSelected && (
                      <div className="absolute -top-4 -right-4 flex items-start justify-end z-30">
                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 bg-rose-500 rounded-full shadow-lg text-white flex items-center justify-center hover:bg-rose-600 transition-all transform hover:scale-110 active:scale-90 border-2 border-white"
                        >
                          <Trash2 size={16} strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 p-2 pl-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 pointer-events-none">
        <div className="flex flex-col pr-6 border-r border-slate-700/50">
          <span className="text-[9px] font-black uppercase text-indigo-400 tracking-widest mb-0.5">Inventory</span>
          <span className="text-sm font-black text-white">{placedItems.length} ITEMS</span>
        </div>
        
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-0.5">Active Setup</span>
            <span className="text-xs font-black text-white uppercase">{boardSize.label} ({activeBoardTexture.label})</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <div className="flex flex-col items-center">
              <ChevronUp size={12} className="text-slate-500" />
              <div className="flex gap-1">
                <ChevronLeft size={12} className="text-slate-500" />
                <ChevronDown size={12} className="text-slate-500" />
                <ChevronRight size={12} className="text-slate-500" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-300 ml-1 uppercase">Precise Adjust</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
