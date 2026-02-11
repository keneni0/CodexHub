"use client";

import { useState } from "react";

type Mode = "online" | "offline" | "hybrid";

export default function EventForm({
  onSubmit,
}: {
  onSubmit?: (data: Record<string, any>) => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [image, setImage] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<Mode>("online");
  const [audience, setAudience] = useState("");
  const [agenda, setAgenda] = useState<string[]>([""]);
  const [organizer, setOrganizer] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function makeSlug(t: string) {
    return t
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slug) setSlug(makeSlug(v));
  };

  const handleAgendaChange = (i: number, v: string) => {
    setAgenda((s) => s.map((it, idx) => (idx === i ? v : it)));
  };

  const addAgendaItem = () => setAgenda((s) => [...s, ""]);
  const removeAgendaItem = (i: number) => setAgenda((s) => s.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title,
      slug: slug || makeSlug(title),
      description,
      overview,
      image,
      venue,
      location,
      date,
      time,
      mode,
      audience,
      agenda: agenda.filter((a) => a.trim() !== ""),
      organizer,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (onSubmit) await onSubmit(payload);
      else {
        // Default: POST to /api/events (adjust to your API)
        await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      alert("Event submitted");
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white/60 rounded-md shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Create / Edit Event</h2>

      <label className="block mb-2">
        <span className="text-sm">Title</span>
        <input className="w-full mt-1 p-2 border rounded" value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
      </label>

      <label className="block mb-2">
        <span className="text-sm">Slug</span>
        <input className="w-full mt-1 p-2 border rounded" value={slug} onChange={(e) => setSlug(makeSlug(e.target.value))} />
      </label>

      <label className="block mb-2">
        <span className="text-sm">Overview</span>
        <textarea className="w-full mt-1 p-2 border rounded" value={overview} onChange={(e) => setOverview(e.target.value)} />
      </label>

      <label className="block mb-2">
        <span className="text-sm">Description</span>
        <textarea className="w-full mt-1 p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block mb-2">
          <span className="text-sm">Date</span>
          <input type="date" className="w-full mt-1 p-2 border rounded" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="block mb-2">
          <span className="text-sm">Time</span>
          <input type="time" className="w-full mt-1 p-2 border rounded" value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <label className="block mb-2">
          <span className="text-sm">Venue</span>
          <input className="w-full mt-1 p-2 border rounded" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </label>
        <label className="block mb-2">
          <span className="text-sm">Location</span>
          <input className="w-full mt-1 p-2 border rounded" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
      </div>

      <label className="block mb-2 mt-2">
        <span className="text-sm">Image URL</span>
        <input className="w-full mt-1 p-2 border rounded" value={image} onChange={(e) => setImage(e.target.value)} />
      </label>

      <label className="block mb-2">
        <span className="text-sm">Mode</span>
        <select className="w-full mt-1 p-2 border rounded" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </label>

      <label className="block mb-2">
        <span className="text-sm">Audience</span>
        <input className="w-full mt-1 p-2 border rounded" value={audience} onChange={(e) => setAudience(e.target.value)} />
      </label>

      <div className="mb-2">
        <span className="text-sm">Agenda</span>
        {agenda.map((it, i) => (
          <div key={i} className="flex gap-2 mt-1">
            <input className="flex-1 p-2 border rounded" value={it} onChange={(e) => handleAgendaChange(i, e.target.value)} />
            <button type="button" onClick={() => removeAgendaItem(i)} className="px-3 bg-red-500 text-white rounded">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addAgendaItem} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Add agenda item</button>
      </div>

      <label className="block mb-2">
        <span className="text-sm">Organizer</span>
        <input className="w-full mt-1 p-2 border rounded" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
      </label>

      <label className="block mb-4">
        <span className="text-sm">Tags (comma separated)</span>
        <input className="w-full mt-1 p-2 border rounded" value={tags} onChange={(e) => setTags(e.target.value)} />
      </label>

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded">
          {submitting ? "Submitting..." : "Submit Event"}
        </button>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="px-4 py-2 bg-gray-200 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}
