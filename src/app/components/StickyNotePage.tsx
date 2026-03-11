import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { StickyNoteBoard } from './StickyNoteBoard';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export interface StickyNote {
  id: string;
  content: string;
  color: string;
  x_position: number;
  y_position: number;
  rotation: number;
  created_at: string;
}

const supabaseUrl = `https://${projectId}.supabase.co`;

function distributeNotes(notes: StickyNote[]): StickyNote[] {
  const count = notes.length;
  if (count === 0) return notes;

  const viewW = window.innerWidth;

  if (viewW < 768) {
    return notes.map((note) => ({
      ...note,
      rotation: Math.random() * 10 - 5,
    }));
  }

  const NOTE_PCT = viewW < 1024 ? 18 : 16;
  const PAD = 3;

  const minX = PAD;
  const maxX = 100 - NOTE_PCT - PAD;
  const minY = 2;
  const maxY = 70;

  const MIN_DIST = viewW < 1024 ? 16 : 18;
  const MAX_ATTEMPTS = 80;

  const placed: { x: number; y: number }[] = [];

  const getPosition = (): { x: number; y: number } => {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);

      let tooClose = false;
      for (const p of placed) {
        const dx = x - p.x;
        const dy = y - p.y;
        if (Math.sqrt(dx * dx + dy * dy) < MIN_DIST) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) return { x, y };
    }
    return {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
    };
  };

  return notes.map((note) => {
    const pos = getPosition();
    placed.push(pos);
    return {
      ...note,
      x_position: pos.x,
      y_position: pos.y,
      rotation: Math.random() * 16 - 8,
    };
  });
}

export function StickyNotePage() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const loadNotes = useCallback(async () => {
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-9111def0/notes?limit=8`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      if (response.ok) {
        const data = await response.json();
        if (!Array.isArray(data)) return [];
        return distributeNotes(data);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const countRes = await fetch(
          `${supabaseUrl}/functions/v1/make-server-9111def0/notes/count`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        if (countRes.ok) {
          const { count } = await countRes.json();
          if (count < 8) {
            await fetch(
              `${supabaseUrl}/functions/v1/make-server-9111def0/reseed`,
              { method: 'POST', headers: { Authorization: `Bearer ${publicAnonKey}` } }
            );
          }
        }
      } catch (err) {
        console.error('Count/reseed error:', err);
      }
      const data = await loadNotes();
      if (data && data.length > 0) setNotes(data);
      setIsLoading(false);
    };
    init();
  }, [loadNotes]);

  const addNote = async (content: string) => {
    const colors = ['#B8D4E8', '#F5D76E'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const rotation = Math.random() * 16 - 8;
    const newNote = { content, color: randomColor, x_position: 42, y_position: 25, rotation };
    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-9111def0/notes`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
          body: JSON.stringify(newNote),
        }
      );
      if (response.ok) {
        const savedNote = await response.json();
        setNotes(prev => [...prev, savedNote]);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNotePosition = async (id: string, x: number, y: number) => {
    setNotes(prev => prev.map((note) => note.id === id ? { ...note, x_position: x, y_position: y } : note));
    try {
      await fetch(
        `${supabaseUrl}/functions/v1/make-server-9111def0/notes/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
          body: JSON.stringify({ x_position: x, y_position: y }),
        }
      );
    } catch (error) {
      console.error('Error updating note position:', error);
    }
  };

  const handleViewMore = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newNotes = await loadNotes();
    if (newNotes && newNotes.length > 0) setNotes(newNotes);
    await new Promise((resolve) => setTimeout(resolve, 50));
    setIsTransitioning(false);
  };

  const handleOpenWorkbook = () => {
    navigate('/workbook');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center">
        <div className="text-[#163612]">Loading...</div>
      </div>
    );
  }

  return (
    <StickyNoteBoard
      notes={notes}
      onAddNote={addNote}
      onUpdatePosition={updateNotePosition}
      onViewMore={handleViewMore}
      isTransitioning={isTransitioning}
      onOpenWorkbook={handleOpenWorkbook}
    />
  );
}
