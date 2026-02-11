import React from "react";
import ExploreBtn from "@/components/ExploreBtn";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import defaults from "@/lib/constants";
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

const page = async () => {
  const bundled = defaults as any[];
  let events: any[] = [];

  try {
    // Avoid fetching an internal API during build — read the local store and bundled constants directly.
    const stored = await readStoredEvents();
    events = [...stored, ...bundled];
  } catch (err) {
    console.error('Failed to fetch /api/events on homepage, using bundled + local fallback', err);
    const stored = await readStoredEvents();
    events = [...stored, ...bundled];
  }

  return (
    <section>
      <h1 className="text-center mt-20">
        The Hub for Every Developer <br /> Event You Can’t Miss
      </h1>
      <p className="text-center mt-4 text-lg">
        Workshops, Hackathons, and Tech Meetups — All in One Place with CodexHub
      </p>

      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3> Featured Events </h3>

        <ul className="events">
          {events.map((event) => (
            <li key={event.slug || event._id}>
              <EventCard
                title={event.title}
                image={event.image}
                slug={event.slug || ''}
                location={event.location || ''}
                date={event.date || ''}
                time={event.time || ''}
              />
            </li>
          ))}

        </ul>
      </div>
    </section>
  );
}

export default page;