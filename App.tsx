import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
  Layers,
  RotateCw
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

  const holeBackgroundUrl = useMemo(() => {
    const svg = `
      <svg width="${GRID_SIZE}" height="${GRID_SIZE}" viewBox="0 0 ${GRID_SIZE} ${GRID_SIZE}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${GRID_SIZE / 2}" cy="${GRID_SIZE / 2}" r="3.5" fill="${activeBoardColor.hole}" />
      </svg>
    `.trim();
    return `url("data:image/svg+xml;base64,${btoa(svg)}")`;
  }, [activeBoardColor.hole]);

  const getLogicalDims = (template: ItemTemplate, rotation: number) => {
    const isSideways = rotation === 90 || rotation === 270;
    return {
      width: isSideways ? template.height : template.width,
      height: isSideways ? template.width : template.height
    };
  };

  const rotateItem = (id: string) => {
    setPlacedItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const nextRotation = (item.rotation + 90) % 360;
      const template = ITEM_TEMPLATES.find(t => t.id === item.templateId)!;
      const dims = getLogicalDims(template, nextRotation);
      
      let newX = item.x;
      let newY = item.y;
      if (newX + dims.width > boardSize.width) newX = Math.max(0, boardSize.width - dims.width);
      if (newY + dims.height > boardSize.height) newY = Math.max(0, boardSize.height - dims.height);
      
      return { ...item, rotation: nextRotation, x: newX, y: newY };
    }));
  };

  useEffect(() => {
    const saved = localStorage.getItem('pegboard_layout_v10');
    if (saved) {
      try {
        const { size, items, colorId, textureId } = JSON.parse(saved);
        const board = BOARD_SIZES.find(b => b.id === size) || BOARD_SIZES[0];
        setBoardSize(board);
        setPlacedItems(items.map((i: any) => ({ ...i, rotation: i.rotation || 0 })));
        if (colorId) setBoardColorId(colorId);
        if (textureId) setBoardTextureId(textureId);
      } catch (e) {
        console.error("Failed to load layout", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pegboard_layout_v10', JSON.stringify({
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
      const dims = getLogicalDims(template, item.rotation);
      let newX = item.x;
      let newY = item.y;

      switch (e.key.toLowerCase()) {
        case 'r':
          e.preventDefault();
          rotateItem(selectedItemId);
          return;
        case 'arrowleft': newX -= 1; break;
        case 'arrowright': newX += 1; break;
        case 'arrowup': newY -= 1; break;
        case 'arrowdown': newY += 1; break;
        case 'delete':
        case 'backspace':
          setPlacedItems(prev => prev.filter(i => i.id !== selectedItemId));
          setSelectedItemId(null);
          return;
        default: return;
      }

      if (newX >= 0 && newY >= 0 && newX + dims.width <= boardSize.width && newY + dims.height <= boardSize.height) {
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
    
    const defaultRotation = templateId === 'prop-katana' ? 90 : 0;
    const currentRotation = dragState.placedItemId 
      ? placedItems.find(i => i.id === dragState.placedItemId)!.rotation 
      : defaultRotation;
      
    const dims = getLogicalDims(template, currentRotation);

    const isOutOfBounds = 
      gridX < 0 || 
      gridY < 0 || 
      gridX + dims.width > boardSize.width || 
      gridY + dims.height > boardSize.height;

    if (!isOutOfBounds) {
      if (dragState.templateId) {
        const newItemId = `item-${Date.now()}`;
        setPlacedItems(prev => [...prev, { id: newItemId, templateId: dragState.templateId!, x: gridX, y: gridY, rotation: defaultRotation }]);
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
      try {
        const canvas = await html2canvas(boardRef.current!, {
          backgroundColor: activeBoardColor.bg,
          scale: 2,
          useCORS: true,
          logging: false
        });
        const link = document.createElement('a');
        link.download = `pegboard-layout.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("Export failed", err);
      } finally {
        setSelectedItemId(originalSelection);
      }
    }, 150);
  };

  const activeTemplate = dragState.templateId 
    ? ITEM_TEMPLATES.find(t => t.id === dragState.templateId)
    : ITEM_TEMPLATES.find(t => t.id === placedItems.find(i => i.id === dragState.placedItemId)?.templateId);

  let ghostX = 0;
  let ghostY = 0;
  let isGhostVisible = false;
  let ghostRotation = 0;

  if (dragState.isDragging && boardRef.current && activeTemplate) {
    const rect = boardRef.current.getBoundingClientRect();
    const relativeX = mousePos.x - rect.left - dragState.offsetX;
    const relativeY = mousePos.y - rect.top - dragState.offsetY;
    
    ghostX = Math.round(relativeX / GRID_SIZE) * GRID_SIZE;
    ghostY = Math.round(relativeY / GRID_SIZE) * GRID_SIZE;

    ghostRotation = dragState.placedItemId 
      ? placedItems.find(i => i.id === dragState.placedItemId)!.rotation 
      : (activeTemplate.id === 'prop-katana' ? 90 : 0);
      
    const dims = getLogicalDims(activeTemplate, ghostRotation);

    const gridX = ghostX / GRID_SIZE;
    const gridY = ghostY / GRID_SIZE;
    if (gridX >= 0 && gridY >= 0 && gridX + dims.width <= boardSize.width && gridY + dims.height <= boardSize.height) {
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
            <h1 className="font-bold text-2xl leading-tight tracking-tight text-slate-900">PegPlanner</h1>
            <div className="flex flex-col">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Precision Shop Layout</p>
              <p className="text-[9px] text-slate-400 font-medium italic">By VashTehStampde and Google Gemini</p>
            </div>
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
            {(['hooks', 'tools', 'bins', 'specialized', 'props'] as Category[]).map(cat => (
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
                    <div className="scale-75 group-hover:scale-90 transition-transform w-full h-full flex items-center justify-center">
                      <ItemIcon type={template.icon} color={template.category === 'hooks' ? '#94a3b8' : template.color} width={template.width} height={template.height} className="max-w-[80%] max-h-[80%] drop-shadow-sm" />
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
                  Press <strong className="text-white">R</strong> to rotate. Press <strong className="text-white">DEL</strong> to remove. Use <strong className="text-white">Arrows</strong> for precision positioning.
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
                className="absolute inset-0 pointer-events-none z-0"
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
              className="absolute inset-0 pointer-events-none z-1"
              style={{
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                backgroundImage: holeBackgroundUrl,
              }}
            />

            {/* Ghost Preview Shadow */}
            {isGhostVisible && activeTemplate && (
              <div 
                className="absolute pointer-events-none z-10 transition-all duration-75"
                style={{
                  left: ghostX,
                  top: ghostY,
                  width: getLogicalDims(activeTemplate, ghostRotation).width * GRID_SIZE,
                  height: getLogicalDims(activeTemplate, ghostRotation).height * GRID_SIZE,
                }}
              >
                <div className="w-full h-full border-2 border-dashed border-indigo-500 rounded bg-indigo-500/10 flex items-center justify-center opacity-40 overflow-hidden">
                  <div 
                    className="flex items-center justify-center pointer-events-none absolute"
                    style={{ 
                      transform: `rotate(${ghostRotation}deg)`,
                      width: activeTemplate.width * GRID_SIZE,
                      height: activeTemplate.height * GRID_SIZE,
                    }}
                  >
                    <ItemIcon type={activeTemplate.icon} color="white" width={activeTemplate.width} height={activeTemplate.height} className="w-full h-full" />
                  </div>
                </div>
              </div>
            )}

            {/* Dragging Item */}
            {dragState.isDragging && activeTemplate && (
              <div 
                className="fixed pointer-events-none z-50 opacity-60 grayscale contrast-125"
                style={{
                  left: mousePos.x,
                  top: mousePos.y,
                  width: getLogicalDims(activeTemplate, ghostRotation).width * GRID_SIZE,
                  height: getLogicalDims(activeTemplate, ghostRotation).height * GRID_SIZE,
                  transform: `translate(-${dragState.offsetX}px, -${dragState.offsetY}px)`,
                }}
              >
                 <div className="w-full h-full relative flex items-center justify-center">
                    <div 
                      className="flex items-center justify-center pointer-events-none absolute"
                      style={{ 
                        transform: `rotate(${ghostRotation}deg)`,
                        width: activeTemplate.width * GRID_SIZE,
                        height: activeTemplate.height * GRID_SIZE,
                      }}
                    >
                      <ItemIcon type={activeTemplate.icon} color={activeTemplate.color} width={activeTemplate.width} height={activeTemplate.height} className="w-full h-full" />
                    </div>
                 </div>
              </div>
            )}

            {placedItems.map(item => {
              const template = ITEM_TEMPLATES.find(t => t.id === item.templateId)!;
              const isBeingDragged = dragState.placedItemId === item.id;
              const isSelected = selectedItemId === item.id;
              const dims = getLogicalDims(template, item.rotation);
              
              return (
                <div
                  key={item.id}
                  onMouseDown={(e) => handleDragStartExisting(item.id, e)}
                  onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); }}
                  className={`absolute group cursor-grab active:cursor-grabbing transition-opacity z-10 ${
                    isBeingDragged ? 'opacity-0' : 'opacity-100 hover:z-20'
                  }`}
                  style={{
                    left: item.x * GRID_SIZE,
                    top: item.y * GRID_SIZE,
                    width: dims.width * GRID_SIZE,
                    height: dims.height * GRID_SIZE,
                  }}
                >
                  <div className={`w-full h-full relative transition-transform origin-center ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-transparent rounded-lg scale-[1.01]' : 'group-hover:scale-[1.005]'}`}>
                    
                    {/* Visual Alignment Aids (Pegs) - Only drawn for rotation 0 for clarity */}
                    {item.rotation === 0 && template.pegs?.map((pegCol, idx) => (
                      <div 
                        key={idx}
                        className="absolute w-2 h-2 bg-slate-900/50 rounded-full z-20 pointer-events-none opacity-40 shadow-sm"
                        style={{ 
                          left: (pegCol + 0.5) * GRID_SIZE - 4,
                          top: 0.5 * GRID_SIZE - 4
                        }}
                      />
                    ))}

                    <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none">
                      <div
                        style={{ 
                          transform: `rotate(${item.rotation}deg)`,
                          width: template.width * GRID_SIZE,
                          height: template.height * GRID_SIZE,
                          flexShrink: 0
                        }}
                        className="flex items-center justify-center"
                      >
                        <ItemIcon 
                          type={template.icon} 
                          color={template.category === 'hooks' ? '#cbd5e1' : template.color} 
                          width={template.width}
                          height={template.height}
                          className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.4)]" 
                        />
                      </div>
                    </div>

                    {!dragState.isDragging && isSelected && (
                      <div className="absolute -top-4 -right-4 flex flex-col items-center gap-2 z-30">
                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-8 bg-rose-500 rounded-full shadow-lg text-white flex items-center justify-center hover:bg-rose-600 transition-all transform hover:scale-110 active:scale-90 border-2 border-white"
                          title="Delete (Del)"
                        >
                          <Trash2 size={16} strokeWidth={3} />
                        </button>
                        <button
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => { e.stopPropagation(); rotateItem(item.id); }}
                          className="w-8 h-8 bg-indigo-500 rounded-full shadow-lg text-white flex items-center justify-center hover:bg-indigo-600 transition-all transform hover:scale-110 active:scale-90 border-2 border-white"
                          title="Rotate (R)"
                        >
                          <RotateCw size={16} strokeWidth={3} />
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