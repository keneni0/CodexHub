/* eslint-disable @next/next/no-img-element */
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "/api/events";

type ModeOption = "online" | "offline" | "hybrid";

export default function CreateEventPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [mode, setMode] = useState<ModeOption>("online");
  const [audience, setAudience] = useState("");
  const [agendaText, setAgendaText] = useState(""); // newline separated
  const [tagsText, setTagsText] = useState(""); // comma separated
  const [organizer, setOrganizer] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!imageFile) {
      setError("Please select an image (JPEG, PNG, or WEBP, max 5MB).");
      setSubmitting(false);
      return;
    }

    const agenda = agendaText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const tags = tagsText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("overview", overview);
    formData.append("venue", venue);
    formData.append("location", location);
    formData.append("date", date);
    formData.append("time", time);
    formData.append("mode", mode);
    formData.append("audience", audience);
    formData.append("agenda", JSON.stringify(agenda));
    formData.append("tags", JSON.stringify(tags));
    formData.append("organizer", organizer);
    formData.append("image", imageFile);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      let body: any = null;
      try {
        body = await res.json();
      } catch (_) {}
      if (!res.ok) {
        throw new Error(body?.message || "Failed to create event");
      }

      setSuccess("Event created successfully.");
      setTitle("");
      setDescription("");
      setOverview("");
      setVenue("");
      setLocation("");
      setDate("");
      setTime("");
      setMode("online");
      setAudience("");
      setAgendaText("");
      setTagsText("");
      setOrganizer("");
      setImageFile(null);
      // Clear file input visually
      const fileInput = document.getElementById("event-image") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";

      // Refresh and navigate home to show the new event
      router.refresh();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pt-16 pb-10">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">Create Event</h1>
        <p className="text-sm text-gray-400">
          Fill the form and upload a cover image (JPEG, PNG, or WEBP, max 5MB).
        </p>
      </header>

      <div className="rounded-2xl border border-gray-800/60 bg-black/30 p-6 shadow-lg shadow-black/30">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
            placeholder="Event title"
          />
        </label>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="input min-h-24"
            placeholder="Short description (max 1000 chars)"
          />
        </label>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Overview
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            required
            className="input min-h-20"
            placeholder="Brief overview (max 500 chars)"
          />
        </label>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Venue
          <input
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
            className="input"
            placeholder="Venue name"
          />
        </label>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Location
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="input"
            placeholder="City or address"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="input"
            />
          </label>
          <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
            Time
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="input"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Mode
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ModeOption)}
            required
            className="input"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Audience
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
            className="input"
            placeholder="e.g., Developers, Students"
          />
        </label>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Agenda (one per line)
          <textarea
            value={agendaText}
            onChange={(e) => setAgendaText(e.target.value)}
            required
            className="input min-h-24"
            placeholder={"Intro\nKeynote\nQ&A"}
          />
        </label>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Tags (comma-separated)
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            required
            className="input"
            placeholder="tech, web, frontend"
          />
        </label>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Organizer
          <input
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            required
            className="input"
            placeholder="Organizer name"
          />
        </label>

        <label className="flex flex-col gap-1 rounded-md border border-gray-700/60 bg-black/10 p-4 text-sm">
          Cover Image (JPEG/PNG/WEBP, max 5MB)
          <input
            id="event-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="input"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary mt-2 w-full sm:w-auto"
        >
          {submitting ? "Creating..." : "Create Event"}
        </button>
      </form>
      </div>
    </section>
  );
}
