import React from 'react';
import EventCard from '@/components/EventCard';
import defaults from '@/lib/constants';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');

async function readStoredEvents() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(raw) as any[];
  } catch (e) {
    return [];
  }
}

const EventsPage = async () => {
  'use server';
  let events: any[] = [];
  // Use the API to fetch events; the API already handles DB vs fallback.
  const bundled = defaults as any[];
  try {
    // Avoid doing an internal `fetch` during build; read the stored local events and bundled defaults.
    const stored = await readStoredEvents();
    events = [...stored, ...bundled];
  } catch (err) {
    console.error('Failed to fetch /api/events, using bundled + local fallback', err);
    const stored = await readStoredEvents();
    events = [...stored, ...bundled];
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pt-16 pb-10">
      <h1 className="text-2xl font-semibold mb-6">All Events</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {events.map((event: any) => (
          <EventCard
            key={event.slug || event._id}
            title={event.title}
            image={event.image}
            slug={event.slug || ''}
            location={event.location || ''}
            date={event.date || ''}
            time={event.time || ''}
          />
        ))}
      </div>
    </section>
  );
};

export default EventsPage;
