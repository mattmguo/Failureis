import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ArrowRight, X, Pencil, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import svgPaths from "../../imports/svg-x4qwf3qsga";
import page1 from "src/assets/bf4635e554153de39eb893b3957f51ae8a58a714.png";
import page2 from "src/assets/732930a17f5fb9ac1d69fcbf732aba5eba69295a.png";
import page3 from "src/assets/a76ec0b7dfe3b3e1a4cb218d25b33abf20495ef2.png";
import page4 from "src/assets/eae20f2d777079d4f3d9dce0c67de1a2fda17006.png";
import page5 from "src/assets/28c5f06bd5f0b5a9103bfbd24bdeb47779be123a.png";
import page6 from "src/assets/88ef5791c0ab1824ce5fe1e9a7b211f3988fda67.png";
import page7 from "src/assets/4bc050aa57fefa229bb181cbe92560f2242d9122.png";
import page8 from "src/assets/cf646b2d8d32380db556638270733e79f0d2a1cd.png";
import page9 from "src/assets/f80b9d8e863ee841f91032d2e86d5d71be9bb4aa.png";
import page10 from "src/assets/095951a48808ce6114209de7ad95c967cba5e1a6.png";
import page11 from "src/assets/dd0c76c6ecb8f5ac734dcbff118336d81c267aac.png";
import page12 from "src/assets/983a4916bce9f251b8a8f9e5d8af26e44b82e987.png";
import page13 from "src/assets/70967de31f2253b72a933668308a7111f0369ad8.png";
import page14 from "src/assets/0b8a80bbc157b4000bcd0884bd34903f64b966a3.png";
import page15 from "src/assets/d4475ed54d1722c8e6338b8a488b34d969ccbbe9.png";
import page16 from "src/assets/ade6ad861f9a596db8a73ee403e534b71fd8dca3.png";
import page17 from "src/assets/8a1fd83def0d34629ac047e846d26eabeb059171.png";
import page18 from "src/assets/5ed3ddd8992ffbe539006f346c28a58a131e6186.png";
import page19 from "src/assets/7d8ab7254614bcf5e69cb246dff527e0fe52b102.png";
import page20 from "src/assets/e63873c269fedb635bdbc29fe7e1a93fa5ea944c.png";

const pages = [page1, page2, page3, page4, page5, page6, page7, page8, page9, page10, page11, page12, page13, page14, page15, page16, page17, page18, page19, page20];

// Poster view has pages 15,16 swapped with 13,14
const posterPageOrder = [
  { src: page1, pageNum: 1 }, { src: page2, pageNum: 2 },
  { src: page3, pageNum: 3 }, { src: page4, pageNum: 4 },
  { src: page8, pageNum: 8 }, { src: page7, pageNum: 7 },
  { src: page6, pageNum: 6 }, { src: page5, pageNum: 5 },
  { src: page9, pageNum: 9 }, { src: page10, pageNum: 10 },
  { src: page11, pageNum: 11 }, { src: page12, pageNum: 12 },
  { src: page16, pageNum: 16 }, { src: page15, pageNum: 15 },
  { src: page14, pageNum: 14 }, { src: page13, pageNum: 13 },
  { src: page17, pageNum: 17 }, { src: page18, pageNum: 18 },
  { src: page19, pageNum: 19 }, { src: page20, pageNum: 20 },
];

// Pages are displayed as spreads: [0,1], [2,3]
// spread 0 = pages 1 & 2, spread 1 = pages 3 & 4
function getSpread(spreadIndex: number) {
  const left = pages[spreadIndex * 2];
  const right = pages[spreadIndex * 2 + 1];
  return { left, right };
}

const totalSpreads = Math.ceil(pages.length / 2);

// Pages (1-indexed) that have sticky note interactivity
const INTERACTIVE_PAGES = new Set([2, 3, 5, 9, 10, 12, 13, 15, 16, 17]);

// Get page number (1-indexed) from spread index and side
function getPageNumber(spreadIndex: number, side: 'left' | 'right'): number {
  return spreadIndex * 2 + (side === 'left' ? 1 : 2);
}

interface StickyNote {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
}

export function WorkbookPage() {
  const navigate = useNavigate();
  const [currentSpread, setCurrentSpread] = useState(0);
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed single page for mobile
  const [isMobile, setIsMobile] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Sticky notes state keyed by page number
  const [notesByPage, setNotesByPage] = useState<Record<number, StickyNote[]>>({});
  const [writingPage, setWritingPage] = useState<number | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [dragging, setDragging] = useState<{ noteId: string; pageNum: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const leftPageRef = useRef<HTMLDivElement>(null);
  const rightPageRef = useRef<HTMLDivElement>(null);
  const singlePageRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const getRefForPage = (pageNum: number): React.RefObject<HTMLDivElement | null> => {
    if (isMobile) return singlePageRef;
    const side = pageNum % 2 === 1 ? 'left' : 'right';
    return side === 'left' ? leftPageRef : rightPageRef;
  };

  const startDrag = (e: React.MouseEvent, noteId: string, pageNum: number) => {
    e.preventDefault();
    const ref = getRefForPage(pageNum);
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const notes = notesByPage[pageNum] || [];
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    const noteX = (note.x / 100) * rect.width;
    const noteY = (note.y / 100) * rect.height;
    setDragOffset({
      x: e.clientX - rect.left - noteX,
      y: e.clientY - rect.top - noteY,
    });
    setDragging({ noteId, pageNum });
  };

  const onMouseMove = useCallback((e: React.MouseEvent, pageNum: number) => {
    if (!dragging || dragging.pageNum !== pageNum) return;
    const ref = isMobile ? singlePageRef : (pageNum % 2 === 1 ? leftPageRef : rightPageRef);
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    const clampedX = Math.max(2, Math.min(78, x));
    const clampedY = Math.max(2, Math.min(80, y));
    setNotesByPage(prev => ({
      ...prev,
      [pageNum]: (prev[pageNum] || []).map(n =>
        n.id === dragging.noteId ? { ...n, x: clampedX, y: clampedY } : n
      ),
    }));
  }, [dragging, dragOffset, isMobile]);

  const onMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const addNote = (pageNum: number) => {
    if (!newNoteText.trim()) return;
    const rotation = (Math.random() - 0.5) * 10;
    const existing = notesByPage[pageNum] || [];
    setNotesByPage(prev => ({
      ...prev,
      [pageNum]: [
        ...(prev[pageNum] || []),
        {
          id: Date.now().toString(),
          text: newNoteText.trim(),
          x: 12 + (existing.length % 3) * 22,
          y: 30 + Math.floor(existing.length / 3) * 25,
          rotation,
        },
      ],
    }));
    setNewNoteText('');
    setWritingPage(null);
  };

  const cancelNote = () => {
    setNewNoteText('');
    setWritingPage(null);
  };

  const startWriting = (pageNum: number) => {
    setWritingPage(pageNum);
  };

  const deleteNote = (pageNum: number, noteId: string) => {
    setNotesByPage(prev => ({
      ...prev,
      [pageNum]: (prev[pageNum] || []).filter(n => n.id !== noteId),
    }));
  };

  // Render sticky note overlay for a given page
  const renderStickyOverlay = (pageNum: number) => {
    if (!INTERACTIVE_PAGES.has(pageNum)) return null;
    const notes = notesByPage[pageNum] || [];
    const isWritingThis = writingPage === pageNum;

    return (
      <>
        {/* Existing sticky notes */}
        {notes.map(note => (
          <div
            key={note.id}
            className="absolute cursor-grab active:cursor-grabbing select-none"
            style={{
              left: `${note.x}%`,
              top: `${note.y}%`,
              width: isMobile ? '40%' : '32%',
              transform: `rotate(${note.rotation}deg)`,
              zIndex: dragging?.noteId === note.id ? 30 : 5,
            }}
            onMouseDown={(e) => startDrag(e, note.id, pageNum)}
          >
            <div
              className="bg-[#F5D76E] p-4 relative"
              style={{
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                aspectRatio: '1 / 1',
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(pageNum, note.id);
                }}
                className="absolute top-1.5 right-1.5 text-[#163612]/60 hover:text-[#163612] cursor-pointer z-10"
              >
                <X size={14} />
              </button>
              <p
                className="text-[#163612] leading-snug break-words"
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: '14px',
                }}
              >
                {note.text}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startWriting(pageNum);
                }}
                className="absolute bottom-3 left-4 text-[#163612]/50 hover:text-[#163612] transition-colors cursor-pointer"
                style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: 'italic',
                  fontSize: '12px',
                }}
              >
                + Add another
              </button>
            </div>
          </div>
        ))}

        {/* New note being written */}
        {isWritingThis && (
          <div
            className="absolute"
            style={{
              left: isMobile ? '12%' : '12%',
              top: isMobile ? '10%' : '30%',
              width: isMobile ? '65%' : '75%',
              zIndex: 25,
            }}
          >
            <div
              className="bg-[#F5D76E] p-5 relative"
              style={{
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                aspectRatio: '1 / 1',
              }}
            >
              <button
                onClick={cancelNote}
                className="absolute top-2 right-2 text-[#163612]/60 hover:text-[#163612] cursor-pointer"
              >
                <X size={18} />
              </button>
              <textarea
                autoFocus
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addNote(pageNum);
                  }
                }}
                placeholder={({
                  2: "What's a small failure you've experienced?",
                  3: "Now reflect on and share a medium failure",
                  5: "Share a big failure you've experienced",
                  9: "Three moments where you achieved something - nothing is too small.",
                  10: "Write down failures that you've turned into growth.",
                  12: "Can you identify any intrinsic motivations for reaching personal goals?",
                  13: "What might your extrinsic motivators be and how do they compare to your intrinsic motivators?",
                  15: "What are you good at?",
                  16: "What can you do that makes you money?",
                  17: "What do you love to do?",
                } as Record<number, string>)[pageNum] || "Share your thoughts..."}
                className="w-full h-[70%] bg-transparent border-none outline-none resize-none text-[#163612] placeholder:text-[#163612]/40 leading-snug"
                style={{
                  fontFamily: "'Lora', serif",
                  fontSize: '20px',
                }}
                maxLength={200}
              />
              <button
                onClick={() => addNote(pageNum)}
                className="absolute bottom-4 left-5 text-[#163612]/70 hover:text-[#163612] transition-colors cursor-pointer"
                style={{
                  fontFamily: "'Oatmeal Pro', sans-serif",
                  fontSize: '14px',
                }}
              >
                ↵ Stick it
              </button>
            </div>
          </div>
        )}

        {/* Write button */}
        {!isWritingThis && notes.length === 0 && (
          <button
            onClick={() => startWriting(pageNum)}
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center bg-[#163612] text-[#fcf8f3] hover:bg-[#1e4a18] hover:scale-105 transition-all cursor-pointer"
            style={{
              fontFamily: "'Lora', serif",
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: '14px',
              padding: '12px 16px',
              zIndex: 10,
              top: [9, 10, 13].includes(pageNum) ? 'calc(30% + 104px)' : 'calc(30% + 80px)',
            }}
          >
            Answer
          </button>
        )}
      </>
    );
  };

  const goToNext = useCallback(() => {
    if (isFlipping) return;
    if (isMobile) {
      if (currentPage >= pages.length - 1) {
        setIsUnfolded(true);
        return;
      }
      setFlipDirection('forward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 500);
      return;
    }
    if (currentSpread >= totalSpreads - 1) {
      setIsUnfolded(true);
      return;
    }
    setFlipDirection('forward');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread(prev => prev + 1);
      setIsFlipping(false);
    }, 700);
  }, [isFlipping, currentSpread, isMobile, currentPage]);

  const goToPrev = useCallback(() => {
    if (isMobile) {
      if (isFlipping || currentPage <= 0) return;
      setFlipDirection('backward');
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
      }, 500);
      return;
    }
    if (isFlipping || currentSpread <= 0) return;
    setFlipDirection('backward');
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentSpread(prev => prev - 1);
      setIsFlipping(false);
    }, 700);
  }, [isFlipping, currentSpread, isMobile, currentPage]);

  const current = getSpread(currentSpread);
  const next = currentSpread < totalSpreads - 1 ? getSpread(currentSpread + 1) : null;
  const prev = currentSpread > 0 ? getSpread(currentSpread - 1) : null;

  const downloadWorkbook = async () => {
    if (!posterRef.current || isSaving) return;
    setIsSaving(true);
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'my-failure-workbook.png';
      link.click();
    } catch (err) {
      console.error('Failed to save workbook:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Render read-only sticky notes for the poster view
  const renderPosterNotes = (pageNum: number) => {
    const notes = notesByPage[pageNum] || [];
    if (notes.length === 0) return null;
    return notes.map(note => (
      <div
        key={note.id}
        className="absolute select-none"
        style={{
          left: `${note.x}%`,
          top: `${note.y}%`,
          width: '32%',
          transform: `rotate(${note.rotation}deg)`,
          zIndex: 5,
        }}
      >
        <div
          className="bg-[#F5D76E] relative"
          style={{
            boxShadow: '0 2px 3px 0 rgba(0, 0, 0, 0.2)',
            aspectRatio: '1 / 1',
            padding: '8%',
          }}
        >
          <p
            className="text-[#163612] leading-snug break-words overflow-hidden"
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 'clamp(5px, 0.7vw, 10px)',
            }}
          >
            {note.text}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex flex-col">
      {/* Top Nav */}
      <nav
        className="flex items-center justify-between"
        style={{
          fontFamily: "'Oatmeal Pro', sans-serif",
          paddingLeft: isMobile ? 24 : 32,
          paddingRight: isMobile ? 24 : 32,
          paddingTop: isMobile ? 16 : 20,
          paddingBottom: isMobile ? 16 : 20,
        }}
      >
        <button
          onClick={() => navigate('/')}
          className="text-[#163612] hover:opacity-70 transition-opacity cursor-pointer"
          style={{
            fontSize: isMobile ? '14px' : '20px',
            textAlign: 'left',
          }}
        >
          What does failure mean to you?
        </button>
        <button
          onClick={() => setShowAbout(true)}
          className="cursor-pointer hover:opacity-70 text-[#163612]"
          style={{
            fontSize: isMobile ? '14px' : '20px',
          }}
        >
          About
        </button>
      </nav>

      {/* Section Title + Book Container grouped together and centered */}
      <AnimatePresence mode="wait">
        {!isUnfolded ? (
          <motion.div
            key="book"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 flex flex-col items-center justify-center px-8"
            style={{ paddingBottom: isMobile || isTablet ? '160px' : '120px' }}
          >
            <div
              className="relative flex"
              style={{
                width: isMobile
                  ? 'min(520px, 82vw)'
                  : isTablet
                  ? (viewportWidth > 0 && viewportWidth < 900
                    ? 'min(460px, 72vw)'
                    : 'min(520px, 80vw)')
                  : 'min(900px, 90vw)',
                perspective: '1800px',
              }}
            >
              {/* Mobile: single page view */}
              {isMobile ? (
                <div
                  ref={singlePageRef}
                  className="relative w-full overflow-hidden rounded-sm"
                  style={{
                    aspectRatio: '1 / 1.25',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    backgroundColor: currentPage % 2 === 0 ? '#D6E4F0' : '#F5F0EA',
                    zIndex: 1,
                  }}
                  onMouseMove={(e) => onMouseMove(e, currentPage + 1)}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentPage}
                      src={pages[currentPage]}
                      alt=""
                      className="w-full h-full object-contain"
                      initial={{ opacity: 0, x: flipDirection === 'forward' ? 40 : -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: flipDirection === 'forward' ? -40 : 40 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </AnimatePresence>
                  {!isFlipping && renderStickyOverlay(currentPage + 1)}
                </div>
              ) : (
                <>
              {/* Left page */}
              <div
                ref={leftPageRef}
                className="relative w-1/2 overflow-hidden rounded-l-sm bg-[#D6E4F0]"
                style={{
                  aspectRatio: '1 / 1.25',
                  boxShadow: '-2px 4px 16px rgba(0,0,0,0.1)',
                  zIndex: 1,
                }}
                onMouseMove={(e) => onMouseMove(e, getPageNumber(currentSpread, 'left'))}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                <img
                  src={
                    isFlipping && flipDirection === 'backward' && prev
                      ? prev.left
                      : current.left
                  }
                  alt=""
                  className="w-full h-full object-contain"
                />
                {!isFlipping && renderStickyOverlay(getPageNumber(currentSpread, 'left'))}
              </div>

              {/* Right page */}
              <div
                ref={rightPageRef}
                className="relative w-1/2 overflow-hidden rounded-r-sm bg-[#F5F0EA]"
                style={{
                  aspectRatio: '1 / 1.25',
                  boxShadow: '2px 4px 16px rgba(0,0,0,0.1)',
                  zIndex: 1,
                }}
                onMouseMove={(e) => onMouseMove(e, getPageNumber(currentSpread, 'right'))}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                <img
                  src={
                    isFlipping && flipDirection === 'forward' && next
                      ? next.right
                      : current.right
                  }
                  alt=""
                  className="w-full h-full object-contain"
                />

                {!isFlipping && renderStickyOverlay(getPageNumber(currentSpread, 'right'))}
              </div>

              {/* === FLIPPING PAGE (forward: right page flips left) === */}
              {isFlipping && flipDirection === 'forward' && (
                <div
                  className="absolute top-0 right-0 w-1/2"
                  style={{
                    aspectRatio: '1 / 1.25',
                    zIndex: 10,
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    animation: 'flipForward 0.7s ease-in-out forwards',
                  }}
                >
                  {/* Front: current right page */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-r-sm"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <img
                      src={current.right}
                      alt=""
                      className="w-full h-full object-contain"
                      style={{ backgroundColor: '#F5F0EA' }}
                    />
                  </div>
                  {/* Back: next left page (mirrored) */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-l-sm"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <img
                      src={next!.left}
                      alt=""
                      className="w-full h-full object-contain"
                      style={{ backgroundColor: '#D6E4F0' }}
                    />
                  </div>
                </div>
              )}

              {/* === FLIPPING PAGE (backward: left page flips right) === */}
              {isFlipping && flipDirection === 'backward' && (
                <div
                  className="absolute top-0 left-0 w-1/2"
                  style={{
                    aspectRatio: '1 / 1.25',
                    zIndex: 10,
                    transformOrigin: 'right center',
                    transformStyle: 'preserve-3d',
                    animation: 'flipBackward 0.7s ease-in-out forwards',
                  }}
                >
                  {/* Front: current left page */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-l-sm"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <img
                      src={current.left}
                      alt=""
                      className="w-full h-full object-contain"
                      style={{ backgroundColor: '#D6E4F0' }}
                    />
                  </div>
                  {/* Back: prev right page (mirrored) */}
                  <div
                    className="absolute inset-0 overflow-hidden rounded-r-sm"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(-180deg)',
                    }}
                  >
                    <img
                      src={prev!.right}
                      alt=""
                      className="w-full h-full object-contain"
                      style={{ backgroundColor: '#F5F0EA' }}
                    />
                  </div>
                </div>
              )}

              {/* Center spine line */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[2px] bg-black/10"
                style={{ zIndex: 20 }}
              />
                </>
              )}
            </div>
          </motion.div>
        ) : (
          /* Unfolded poster view - 4 columns x 5 rows */
          <motion.div
            key="poster"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="flex-1 flex flex-col items-center px-8 py-8 pb-52 overflow-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[#163612] mb-[24px] text-center"
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 400,
                fontSize: '28px',
              }}
            >
              The Complete Workbook
            </motion.h1>
            <motion.div
              ref={posterRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              className="grid grid-cols-4 w-full"
              style={{
                maxWidth: 'min(1200px, 95vw)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              }}
            >
              {posterPageOrder.map(({ src, pageNum }, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.03, duration: 0.4 }}
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: '1 / 1.25',
                    backgroundColor: index % 2 === 0 ? '#D6E4F0' : '#F5F0EA',
                  }}
                >
                  <img
                    src={src}
                    alt={`Page ${pageNum}`}
                    className="w-full h-full object-cover"
                  />
                  {renderPosterNotes(pageNum)}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-center"
        style={{
          height: isUnfolded ? (isMobile ? '200px' : '160px') : (isMobile || isTablet ? '160px' : '120px'),
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
          zIndex: 20,
        }}
      >
        <div className={`absolute bottom-0 left-0 right-0 pb-5 px-8 ${(isUnfolded && isMobile) || (!isUnfolded && (isMobile || isTablet)) ? 'flex flex-col items-center gap-3' : 'flex items-end justify-between'}`}>
          {isUnfolded ? (
            <div
              className={`text-[#163612] leading-[24px] ${isMobile ? 'text-center' : 'text-left'}`}
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 500,
                fontStyle: 'italic',
                fontSize: isMobile ? '14px' : '16px',
              }}
            >
              <p>Any final thoughts? Be sure to jot them down.</p>
              <p>You've done the brave work of reflecting on failure!</p>
            </div>
          ) : (
            <div
              className={`text-[#163612] leading-[24px] text-center`}
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 500,
                fontStyle: 'italic',
                fontSize: isMobile ? '14px' : '16px',
              }}
            >
              <p>{(() => {
                const idx = isMobile ? currentPage : currentSpread;
                const threshold1 = isMobile ? 10 : 4;
                const threshold2 = isMobile ? 16 : 8;
                if (idx <= threshold1) return '( 1 ) Understanding personal motivators and goals';
                if (idx <= threshold2) return '( 2 ) Understanding personal motivators and goals';
                return '( 3 ) Applying newfound learnings with confidence';
              })()}</p>
            </div>
          )}
          <div className={`${(isUnfolded && isMobile) || (!isUnfolded && (isMobile || isTablet)) ? '' : 'absolute left-1/2 -translate-x-1/2'} flex items-center gap-8`}>
          {isUnfolded ? (
            <button
              onClick={() => setIsUnfolded(false)}
              className="flex items-center gap-2 text-[#163612] hover:opacity-70 transition-opacity cursor-pointer"
              style={{ fontFamily: "'Oatmeal Pro', sans-serif", fontSize: '16px' }}
            >
              <ArrowLeft size={16} />
              Back to Book
            </button>
          ) : (
            <>
              <button
                onClick={goToPrev}
                disabled={(isMobile ? currentPage === 0 : currentSpread === 0) || isFlipping}
                className="flex items-center gap-2 text-[#163612] disabled:opacity-30 hover:opacity-70 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                style={{ fontFamily: "'Oatmeal Pro', sans-serif", fontSize: '16px' }}
              >
                <ArrowLeft size={16} />
                Previous
              </button>
              <span
                className="text-[#163612] text-[16px]"
                style={{ fontFamily: "'Oatmeal Pro', sans-serif" }}
              >
                {isMobile
                  ? `${currentPage + 1} / ${pages.length}`
                  : `${currentSpread + 1} / ${totalSpreads}`}
              </span>
              <button
                onClick={goToNext}
                disabled={isFlipping}
                className="flex items-center gap-2 text-[#163612] disabled:opacity-30 hover:opacity-70 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                style={{ fontFamily: "'Oatmeal Pro', sans-serif", fontSize: '16px' }}
              >
                {(isMobile ? currentPage === pages.length - 1 : currentSpread === totalSpreads - 1) ? 'Unfold' : 'Next'}
                <ArrowRight size={16} />
              </button>
            </>
          )}
          {isUnfolded && (
            <button
              onClick={downloadWorkbook}
              disabled={isSaving}
              className="flex items-center gap-2 text-[#163612] hover:opacity-70 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-wait"
              style={{ fontFamily: "'Oatmeal Pro', sans-serif", fontSize: '16px' }}
            >
              <Download size={16} />
              {isSaving ? 'Saving...' : 'Save as PNG'}
            </button>
          )}
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes flipForward {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-180deg); }
        }
        @keyframes flipBackward {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
      `}</style>

      {/* About Sheet Overlay */}
      {showAbout && (
        <div
          className="fixed inset-0 bg-[#c5dded] overflow-auto"
          style={{ zIndex: 50 }}
        >
          {/* Top bar with About title and close button, center-aligned */}
          <div
            className="absolute flex items-center justify-between w-full"
            style={{
              top: isMobile ? '32px' : isTablet ? '40px' : '60px',
              left: 0,
              right: 0,
              paddingLeft: isMobile ? 24 : isTablet ? 40 : 90,
              paddingRight: isMobile ? 24 : isTablet ? 40 : 90,
            }}
          >
            <h2
              className="text-[#163612]"
              style={{
                fontFamily: "'Lora', serif",
                fontWeight: 500,
                fontStyle: 'italic',
                fontSize: isMobile ? '28px' : isTablet ? '40px' : '40px',
                margin: 0,
              }}
            >
              About
            </h2>
            <button
              onClick={() => setShowAbout(false)}
              className="cursor-pointer hover:opacity-70 transition-opacity"
            >
              <svg
                width={isMobile ? 48 : isTablet ? 64 : 96}
                height={isMobile ? 48 : isTablet ? 64 : 96}
                viewBox="0 0 96 96"
                fill="none"
              >
                <g clipPath="url(#clip0_about_close)">
                  <path d={svgPaths.p28da5c00} fill="#163612" />
                </g>
                <defs>
                  <clipPath id="clip0_about_close">
                    <rect fill="white" height="96" width="96" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div
            className={`${isMobile ? 'flex flex-col gap-10 px-6 pt-[100px] pb-12' : isTablet ? 'flex flex-col gap-10 px-10 pt-[180px] pb-12' : 'flex gap-16 px-[90px] pt-[205px] pb-12'}`}
          >
            {/* Left column - description */}
            <div
              className="text-[#163612] whitespace-pre-wrap"
              style={{
                fontFamily: "'Oatmeal Pro TRIAL', sans-serif",
                fontSize: isMobile ? '18px' : isTablet ? '20px' : '24px',
                lineHeight: 'normal',
                maxWidth: isMobile || isTablet ? '100%' : '599px',
                fontWeight: 400,
              }}
            >
              <p className="mb-0">Failure is... is a collaborative workbook that invites learners to reflect on their relationship with failure. Through a sequence of small activities and prompts, participants explore the stories they tell themselves about success, mistakes, and growth. What begins as individual reflection gradually unfolds into a broader perspective—revealing failure not as an end, but as an essential part of learning and becoming.</p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">We loved creating this workbook, and we hope the experience of moving through it is just as meaningful for you as it was for us while making it.</p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">Love,</p>
              <p>Andrea, Sophia, Matthew</p>
            </div>

            {/* Right column - team bios */}
            <div
              className="text-[#163612] whitespace-pre-wrap"
              style={{
                fontFamily: "'Oatmeal Pro TRIAL', sans-serif",
                fontSize: isMobile ? '18px' : isTablet ? '20px' : '24px',
                lineHeight: 'normal',
                maxWidth: isMobile || isTablet ? '100%' : '490px',
                fontWeight: 400,
              }}
            >
              <p className="mb-0"><span style={{ fontWeight: 500 }}>Andrea Benatar</span><span> is a senior studying Product Design at Carnegie Mellon University.</span></p>
              <p className="mb-0">&nbsp;</p>
              <p className="mb-0">
                <span style={{ fontWeight: 500 }}>Sophia Fan</span>
                <span> recently graduated with a degree in Communication Design from Carnegie Mellon University.</span>
              </p>
              <p className="mb-0">&nbsp;</p>
              <p>
                <span style={{ fontWeight: 500 }}>Matthew Guo</span>
                <span> is a senior studying Information Systems and Human Computer Interaction at Carnegie Mellon University.</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}