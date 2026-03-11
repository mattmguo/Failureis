import * as kv from "./kv_store.tsx";

// Seed initial sticky notes
export async function seedInitialNotes() {
  const existingNotes = await kv.getByPrefix("note:");
  
  // Only seed if no notes exist
  if (existingNotes.length > 0) {
    return;
  }

  const seedNotes = [
    // Page 1 (8 notes)
    {
      content: "Not meeting expectations - mine or others'",
      color: "#B8D4E8",
      x_position: 150,
      y_position: 180,
      rotation: -3,
    },
    {
      content: "An opportunity to learn what doesn't work",
      color: "#F5D76E",
      x_position: 420,
      y_position: 140,
      rotation: 5,
    },
    {
      content: "Feeling like I let people down",
      color: "#F5D76E",
      x_position: 720,
      y_position: 200,
      rotation: -6,
    },
    {
      content: "When the outcome doesn't match the effort",
      color: "#B8D4E8",
      x_position: 980,
      y_position: 160,
      rotation: 4,
    },
    {
      content: "Part of the process, not the end",
      color: "#B8D4E8",
      x_position: 200,
      y_position: 420,
      rotation: -5,
    },
    {
      content: "Proof that I tried something new",
      color: "#F5D76E",
      x_position: 500,
      y_position: 440,
      rotation: 7,
    },
    {
      content: "The gap between where I am and where I want to be",
      color: "#B8D4E8",
      x_position: 850,
      y_position: 410,
      rotation: -4,
    },
    {
      content: "A redirect, not a dead end",
      color: "#F5D76E",
      x_position: 300,
      y_position: 650,
      rotation: 3,
    },
    
    // Page 2 (8 more notes)
    {
      content: "The fear of disappointing my parents",
      color: "#B8D4E8",
      x_position: 180,
      y_position: 160,
      rotation: -4,
    },
    {
      content: "When I don't live up to my potential",
      color: "#F5D76E",
      x_position: 450,
      y_position: 190,
      rotation: 6,
    },
    {
      content: "Missing the mark, but learning where to aim next",
      color: "#B8D4E8",
      x_position: 750,
      y_position: 150,
      rotation: -3,
    },
    {
      content: "Embarrassment mixed with growth",
      color: "#F5D76E",
      x_position: 1000,
      y_position: 180,
      rotation: 5,
    },
    {
      content: "A chapter, not the whole story",
      color: "#B8D4E8",
      x_position: 220,
      y_position: 400,
      rotation: -6,
    },
    {
      content: "The tuition fee for wisdom",
      color: "#F5D76E",
      x_position: 520,
      y_position: 420,
      rotation: 4,
    },
    {
      content: "When my best wasn't enough this time",
      color: "#B8D4E8",
      x_position: 820,
      y_position: 440,
      rotation: -5,
    },
    {
      content: "Feedback disguised as disappointment",
      color: "#F5D76E",
      x_position: 350,
      y_position: 630,
      rotation: 7,
    },

    // Page 3 (8 more notes)
    {
      content: "Being brave enough to risk it",
      color: "#F5D76E",
      x_position: 160,
      y_position: 170,
      rotation: -3,
    },
    {
      content: "The space between trying and succeeding",
      color: "#B8D4E8",
      x_position: 440,
      y_position: 150,
      rotation: 5,
    },
    {
      content: "Discovering my limits so I can push them",
      color: "#F5D76E",
      x_position: 730,
      y_position: 180,
      rotation: -4,
    },
    {
      content: "Not who I am, but what I did",
      color: "#B8D4E8",
      x_position: 990,
      y_position: 160,
      rotation: 6,
    },
    {
      content: "The cost of playing it safe",
      color: "#F5D76E",
      x_position: 210,
      y_position: 410,
      rotation: -5,
    },
    {
      content: "When the universe says 'not yet'",
      color: "#B8D4E8",
      x_position: 510,
      y_position: 430,
      rotation: 4,
    },
    {
      content: "Proof I'm pushing my boundaries",
      color: "#F5D76E",
      x_position: 840,
      y_position: 420,
      rotation: -6,
    },
    {
      content: "A detour on the way to success",
      color: "#B8D4E8",
      x_position: 330,
      y_position: 640,
      rotation: 3,
    },
  ];

  for (const note of seedNotes) {
    const id = crypto.randomUUID();
    await kv.set(`note:${id}`, {
      id,
      ...note,
      created_at: new Date().toISOString(),
    });
  }

  console.log(`Seeded ${seedNotes.length} initial sticky notes`);
}
