import { useRef, useState, useEffect, useCallback } from 'react';
import { StickyNote } from './StickyNotePage';

/*
 * Fluid note sizing via CSS clamp():
 *   width:     175px @ 768vw  →  220px @ 1200vw
 *   font:      17px  @ 768vw  →  20px  @ 1200vw
 *   padding:   14px  @ 768vw  →  16px  @ 1200vw
 *
 * Positions are stored as percentages of the canvas container,
 * so notes reflow smoothly on resize without jumping.
 */

const NOTE_STYLE = {
  width: 'clamp(210px, calc(160px + 5vw), 260px)',
  aspectRatio: '1',
  padding: 'clamp(14px, calc(10px + 0.5vw), 20px)',
  fontSize: 'clamp(17px, calc(11px + 0.8vw), 22px)',
};

interface Props {
  note: StickyNote;
  /** Called with percentage-based x, y after drag ends */
  onUpdatePosition: (id: string, x: number, y: number) => void;
  isMobile?: boolean;
  /** Ref to the canvas container, needed for drag → percentage conversion */
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

export function DraggableStickyNote({ note, onUpdatePosition, isMobile = false, canvasRef }: Props) {
  // During drag, we override with pixel-based positioning for 60fps performance,
  // then convert back to percentages on release.
  const [isDragging, setIsDragging] = useState(false);
  const [dragPx, setDragPx] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragPxRef = useRef<{ x: number; y: number } | null>(null);
  const noteIdRef = useRef(note.id);

  useEffect(() => {
    noteIdRef.current = note.id;
  }, [note.id]);

  // Reset drag state when note changes (e.g. new batch)
  useEffect(() => {
    setDragPx(null);
    dragPxRef.current = null;
  }, [note.id, note.x_position, note.y_position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;
    dragPxRef.current = { x: newX, y: newY };
    setDragPx({ x: newX, y: newY });
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    // Convert final pixel position back to percentage of canvas
    if (dragPxRef.current && canvasRef?.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const pctX = ((dragPxRef.current.x - rect.left) / rect.width) * 100;
      const pctY = ((dragPxRef.current.y - rect.top) / rect.height) * 100;
      onUpdatePosition(noteIdRef.current, pctX, pctY);
    }

    setDragPx(null);
    dragPxRef.current = null;

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, onUpdatePosition, canvasRef]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    isDraggingRef.current = true;
    setIsDragging(true);

    // Compute the element's current pixel position from its percentage
    const el = e.currentTarget as HTMLElement;
    const elRect = el.getBoundingClientRect();
    const startX = elRect.left;
    const startY = elRect.top;

    dragOffsetRef.current = {
      x: e.clientX - startX,
      y: e.clientY - startY,
    };

    dragPxRef.current = { x: startX, y: startY };
    setDragPx({ x: startX, y: startY });

    e.preventDefault();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, handleMouseUp, isMobile]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // ── MOBILE: static card in a column, square ──
  if (isMobile) {
    return (
      <div
        className="select-none"
        style={{
          backgroundColor: note.color,
          width: 'min(280px, 85vw)',
          aspectRatio: '1',
          padding: '16px',
          transform: `rotate(${note.rotation}deg)`,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        <p
          className="text-[#163612] break-words whitespace-pre-wrap"
          style={{
            fontFamily: "'Lora', serif",
            fontSize: '18px',
            lineHeight: '1.6',
          }}
        >
          {note.content}
        </p>
      </div>
    );
  }

  // ── DESKTOP / TABLET: percentage-positioned, draggable, fluid size ──
  const positionStyle: React.CSSProperties = isDragging && dragPx
    ? { position: 'fixed', left: `${dragPx.x}px`, top: `${dragPx.y}px` }
    : { position: 'absolute', left: `${note.x_position}%`, top: `${note.y_position}%` };

  return (
    <div
      className="select-none cursor-move"
      style={{
        ...positionStyle,
        backgroundColor: note.color,
        width: NOTE_STYLE.width,
        aspectRatio: NOTE_STYLE.aspectRatio,
        padding: NOTE_STYLE.padding,
        transform: `rotate(${note.rotation}deg)`,
        boxShadow: isHovered || isDragging
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        zIndex: isDragging ? 50 : 10,
        transition: isDragging ? 'box-shadow 0.2s' : 'box-shadow 0.2s',
        overflow: 'hidden',
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p
        className="text-[#163612] break-words whitespace-pre-wrap"
        style={{
          fontFamily: "'Lora', serif",
          fontSize: NOTE_STYLE.fontSize,
          lineHeight: '1.6',
        }}
      >
        {note.content}
      </p>
    </div>
  );
}