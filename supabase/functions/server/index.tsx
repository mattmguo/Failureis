import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { seedInitialNotes } from "./seed_data.tsx";

const app = new Hono();

// Seed initial data on startup
seedInitialNotes().catch(console.error);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9111def0/health", (c) => {
  return c.json({ status: "ok" });
});

// Debug: get count of notes
app.get("/make-server-9111def0/notes/count", async (c) => {
  try {
    const allNotes = await kv.getByPrefix("note:");
    return c.json({ count: allNotes.length });
  } catch (error) {
    console.log(`Error counting notes: ${error}`);
    return c.json({ error: "Failed to count notes" }, 500);
  }
});

// Get all sticky notes
app.get("/make-server-9111def0/notes", async (c) => {
  try {
    const limit = parseInt(c.req.query("limit") || "8");
    
    const allNotes = await kv.getByPrefix("note:");
    
    console.log(`Total notes in DB: ${allNotes.length}, requesting ${limit} random notes`);
    console.log(`Note IDs in DB: ${allNotes.map((n: any) => n.id).join(', ')}`);
    
    // Shuffle using Fisher-Yates and take the first `limit`
    const shuffled = [...allNotes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    const selectedNotes = shuffled.slice(0, limit);
    
    console.log(`Returning ${selectedNotes.length} random notes: ${selectedNotes.map((n: any) => n.id).join(', ')}`);
    
    return c.json(selectedNotes);
  } catch (error) {
    console.log(`Error fetching notes: ${error}`);
    return c.json({ error: "Failed to fetch notes" }, 500);
  }
});

// Create a new sticky note
app.post("/make-server-9111def0/notes", async (c) => {
  try {
    const body = await c.req.json();
    const { content, color, x_position, y_position, rotation } = body;

    if (!content) {
      return c.json({ error: "Content is required" }, 400);
    }

    const id = crypto.randomUUID();
    const note = {
      id,
      content,
      color,
      x_position,
      y_position,
      rotation,
      created_at: new Date().toISOString(),
    };

    await kv.set(`note:${id}`, note);
    return c.json(note, 201);
  } catch (error) {
    console.log(`Error creating note: ${error}`);
    return c.json({ error: "Failed to create note" }, 500);
  }
});

// Update sticky note position
app.patch("/make-server-9111def0/notes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { x_position, y_position } = body;

    const existingNote = await kv.get(`note:${id}`);
    if (!existingNote) {
      return c.json({ error: "Note not found" }, 404);
    }

    const updatedNote = {
      ...existingNote,
      x_position,
      y_position,
    };

    await kv.set(`note:${id}`, updatedNote);
    return c.json(updatedNote);
  } catch (error) {
    console.log(`Error updating note position: ${error}`);
    return c.json({ error: "Failed to update note" }, 500);
  }
});

// Delete all notes (for clearing duplicates)
app.delete("/make-server-9111def0/notes/all", async (c) => {
  try {
    const notes = await kv.getByPrefix("note:");
    const noteIds = notes.map((note: any) => `note:${note.id}`);
    if (noteIds.length > 0) {
      await kv.mdel(noteIds);
    }
    return c.json({ deleted: noteIds.length });
  } catch (error) {
    console.log(`Error deleting notes: ${error}`);
    return c.json({ error: "Failed to delete notes" }, 500);
  }
});

// Reseed database
app.post("/make-server-9111def0/reseed", async (c) => {
  try {
    // Delete all existing notes
    const notes = await kv.getByPrefix("note:");
    const noteIds = notes.map((note: any) => `note:${note.id}`);
    if (noteIds.length > 0) {
      await kv.mdel(noteIds);
    }
    
    // Reseed
    await seedInitialNotes();
    
    return c.json({ success: true, message: "Database reseeded" });
  } catch (error) {
    console.log(`Error reseeding: ${error}`);
    return c.json({ error: "Failed to reseed" }, 500);
  }
});

Deno.serve(app.fetch);