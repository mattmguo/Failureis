import { useRef, useState } from 'react';
import { StickyNote as StickyNoteType } from './StickyNotePage';
import { DraggableStickyNote } from './DraggableStickyNote';
import { useIsMobile } from './useBreakpoint';
import { ArrowRight, Plus } from 'lucide-react';

interface Props {
  notes: StickyNoteType[];
  onAddNote: (content: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onViewMore: () => void;
  isTransitioning: boolean;
  onOpenWorkbook?: () => void;
}

export function StickyNoteBoard({ notes, onAddNote, onUpdatePosition, onViewMore, isTransitioning, onOpenWorkbook }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddClick = () => {
    setIsAdding(true);
    setNewNoteContent('');
  };

  const handleSubmit = () => {
    if (newNoteContent.trim()) {
      onAddNote(newNoteContent.trim());
      setNewNoteContent('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewNoteContent('');
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] relative overflow-hidden">
      {/* Focus overlay when adding */}
      <div
        className="fixed inset-0 z-30 pointer-events-none"
        style={{
          backdropFilter: isAdding ? 'blur(6px)' : 'blur(0px)',
          WebkitBackdropFilter: isAdding ? 'blur(6px)' : 'blur(0px)',
          backgroundColor: isAdding ? 'rgba(252, 248, 243, 0.5)' : 'rgba(252, 248, 243, 0)',
          opacity: isAdding ? 1 : 0,
          transition: 'backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease, background-color 0.4s ease, opacity 0.4s ease',
        }}
      />

      {/* Header – fluid sizing */}
      <div
        className={`relative ${isMobile ? 'pt-10 pb-6 px-6' : 'pt-16 pb-8'}`}
        style={{ zIndex: isAdding ? 40 : 10 }}
      >
        <h1
          className="text-center text-[#163612]"
          style={{
            fontFamily: "'Oatmeal Pro', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? '1.875rem' : 'clamp(2.25rem, calc(1.5rem + 2vw), 3rem)',
          }}
        >
          What does failure mean to{' '}
          <span style={{ fontFamily: "'Lora', serif", fontStyle: 'italic' }}>you</span>
          ?
        </h1>
      </div>

      {/* ── NOTES AREA ── */}
      {isMobile ? (
        /* Mobile: single-column scroll of square notes */
        <div
          className="flex flex-col items-center gap-5 px-6 pb-28"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 0.4s ease-in-out',
          }}
        >
          {isAdding && (
            <div
              className="bg-[#F5D76E] shadow-md cursor-text"
              style={{
                width: 'min(280px, 85vw)',
                aspectRatio: '1',
                padding: '16px',
                transform: 'rotate(1deg)',
                zIndex: 100,
                position: 'relative',
              }}
            >
              <textarea
                autoFocus
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Try to write down the first thing that comes to mind."
                className="w-full h-full bg-transparent border-none outline-none resize-none text-[#163612] placeholder-[#163612]/50"
                style={{ fontFamily: "'Lora', serif", fontSize: '18px', lineHeight: '1.6' }}
                onKeyDown={(e) => { if (e.key === 'Escape') handleCancel(); }}
              />
            </div>
          )}

          {notes.map((note) => (
            <DraggableStickyNote
              key={note.id}
              note={note}
              onUpdatePosition={onUpdatePosition}
              isMobile
            />
          ))}
        </div>
      ) : (
        /* Tablet & Desktop: percentage-positioned freeform canvas */
        <div
          ref={canvasRef}
          className="relative w-full"
          style={{
            minHeight: 'calc(100vh - 200px)',
            opacity: isTransitioning ? 0 : 1,
            transition: 'opacity 0.4s ease-in-out',
          }}
        >
          {notes.map((note) => (
            <DraggableStickyNote
              key={note.id}
              note={note}
              onUpdatePosition={onUpdatePosition}
              canvasRef={canvasRef}
            />
          ))}

          {isAdding && (
            <div
              className="absolute bg-[#F5D76E] shadow-md cursor-text"
              style={{
                width: 'clamp(210px, calc(160px + 5vw), 260px)',
                aspectRatio: '1',
                padding: 'clamp(14px, calc(10px + 0.5vw), 20px)',
                left: '50%',
                top: '200px',
                transform: 'translateX(-50%) rotate(1deg)',
                zIndex: 100,
              }}
            >
              <textarea
                autoFocus
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Try to write down the first thing that comes to mind."
                className="w-full h-full bg-transparent border-none outline-none resize-none text-[#163612] placeholder-[#163612]/50"
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 'clamp(17px, calc(11px + 0.8vw), 22px)',
                  lineHeight: '1.6',
                }}
                onKeyDown={(e) => { if (e.key === 'Escape') handleCancel(); }}
              />
            </div>
          )}
        </div>
      )}

      {/* Red circle – centered, peeking from bottom */}
      <div
        className={`fixed left-1/2 flex items-center justify-center ${onOpenWorkbook ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          width: isMobile ? '180px' : 'clamp(240px, calc(180px + 8vw), 300px)',
          height: isMobile ? '180px' : 'clamp(240px, calc(180px + 8vw), 300px)',
          bottom: isMobile ? '-60px' : 'clamp(-140px, calc(-100px - 4vw), -130px)',
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          backgroundColor: '#EA6233',
          zIndex: 21,
          transition: 'transform 0.3s ease',
        }}
        onClick={onOpenWorkbook}
        onMouseEnter={(e) => { if (onOpenWorkbook) e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'; }}
        onMouseLeave={(e) => { if (onOpenWorkbook) e.currentTarget.style.transform = 'translateX(-50%)'; }}
      >
        <p
          className="text-[#fcf8f3] text-center"
          style={{
            fontFamily: "'Lora', serif",
            fontWeight: 500,
            fontSize: isMobile ? '16px' : 'clamp(18px, calc(14px + 0.5vw), 22px)',
            lineHeight: '1.5',
            transform: 'rotate(-9deg)',
            marginTop: isMobile ? '-65px' : '-115px',
            maxWidth: '160px',
          }}
        >
          Change your perspective
        </p>
      </div>

      {/* Bottom bar */}
      <div className={`fixed bottom-0 left-0 right-0 ${isMobile ? 'px-4' : 'px-8'}`}
        style={{
          height: isMobile ? '160px' : '170px',
          backdropFilter: isAdding ? 'none' : 'blur(12px)',
          WebkitBackdropFilter: isAdding ? 'none' : 'blur(12px)',
          maskImage: isAdding ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 40%)',
          WebkitMaskImage: isAdding ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 40%)',
          zIndex: isAdding ? 40 : 20,
        }}
      >
        <div className={`absolute bottom-0 left-0 right-0 flex justify-between ${isMobile ? 'pb-4 px-4' : 'pb-5 px-8'}`}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {/* Left text */}
          <div
            className="flex items-center min-w-0"
            style={{
              maxWidth: isMobile ? '40%' : 'min(calc(50% - 200px), 360px)',
              opacity: isAdding ? 0 : 1,
              transition: 'opacity 0.3s ease',
              pointerEvents: isAdding ? 'none' : 'auto',
            }}
          >
            {!isMobile && (
              <p
                className="text-[#134025]"
                style={{ fontFamily: "'Oatmeal Pro', sans-serif", fontSize: '16px' }}
              >
                We were curious about what college students in the US think about failure.{' '}
                <span
                  className="underline cursor-pointer hover:text-[#163612]"
                  onClick={onViewMore}
                >
                  View more responses
                </span>
              </p>
            )}

            {isMobile && (
              <span
                className="text-[#134025] underline cursor-pointer self-center"
                style={{ fontFamily: "'Oatmeal Pro', sans-serif", fontSize: '16px' }}
                onClick={onViewMore}
              >
                View more
              </span>
            )}
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {isAdding ? (
              <>
                <button
                  onClick={handleCancel}
                  className={`text-[#134025] hover:text-[#163612] transition-colors ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'}`}
                  style={{ fontFamily: "'Oatmeal Pro', sans-serif", fontSize: '16px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!newNoteContent.trim()}
                  className={`flex items-center gap-2 bg-[#163612] text-white rounded-none hover:bg-[#1a4216] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? 'px-4 py-1.5' : 'px-6 py-2'}`}
                  style={{ fontFamily: "'Oatmeal Pro', sans-serif", fontSize: '16px' }}
                >
                  <ArrowRight size={18} />
                  Submit
                </button>
              </>
            ) : (
              <button
                onClick={handleAddClick}
                className={`flex items-center justify-center gap-2 bg-[#163612] text-white hover:bg-[#1a4216] transition-colors ${isMobile ? 'h-9 px-4' : 'h-10 px-5'}`}
                style={{ fontFamily: "'Oatmeal Pro', sans-serif", fontSize: '16px' }}
              >
                <Plus size={18} />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}