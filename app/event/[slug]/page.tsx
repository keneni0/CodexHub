import { notFound } from "next/navigation";
import Image from "next/image";
import { ImageDown } from "lucide-react";
import BookEvent from "@/components/Book";
import { getSimilarEventBySlug } from "@/lib/actions/eventactions";
// Avoid static import of `@/database/event.model` — use a local any type instead to prevent build-time module resolution errors when DB model is absent.
type IEvent = any;
import EventCard from "@/components/EventCard";
import { promises as fs } from 'fs';
import path from 'path';


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon,alt,label}: {icon:string,alt:string,label:string}) => (
    <div className="flex-row-gap-2 items-center ">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)


// FIX:
// - Define the correct type for similarEvents. In this codebase, 'IEvent' is not present—likely use 'Event' or 'any' for now unless a proper Event type/interface is defined elsewhere.
// - Ensure 'slug' is declared and available before use.

// If 'slug' is only available in the EventDetailsPage function, then similarEvents should be fetched inside that scope, not top-level.
// Since this is a top-level statement and 'slug' is not yet defined, remove this code from here and move fetching logic inside the component as needed.

// Removed invalid code. Similar event fetching should be handled where 'slug' is in scope.

const EventAgenda =({ agendaItems }: {agendaItems: string[] }) => (
    <div className="agenda">
        <h2>Agenda</h2>
        <div style={{whiteSpace: 'pre-line'}}>
            {agendaItems.join('\n')}
        </div>
    </div>
)


const EventTags = ({ tags }: {tags: string[]}) => (
    <div className="flex flex-row gap-1.5 flex-wrap">
        {tags.map((tag) =>(
            <div className="pill" key={tag}>{tag}</div>
        ))}
    </div>
)

const EventDetailsPage = async ({params}:{params: Promise<{slug: string}>}) => {  //Next.js automatically injects params from the URL
        const { slug } = await params;

        // Build a safe API URL. Some environments set NEXT_PUBLIC_BASE_URL="undefined" — guard against that.
        const baseCandidate = typeof BASE_URL === 'string' && BASE_URL !== 'undefined' && BASE_URL.trim() !== '' ? BASE_URL : undefined;
        let apiUrl: string;
        try {
            apiUrl = baseCandidate ? new URL(`/api/events/${slug}`, baseCandidate).toString() : `/api/events/${slug}`;
        } catch (e) {
            apiUrl = `/api/events/${slug}`;
        }

        let eventSource: any = null;
        try {
            const res = await fetch(apiUrl, { cache: 'no-store' });
            if (res.ok) {
                const body = await res.json();
                eventSource = body?.event ?? null;
            }
        } catch (err) {
            eventSource = null;
        }

        // Fallback to bundled constants or local stored file if API/DB not available
        if (!eventSource) {
            const defaults = (await import('@/lib/constants')).default as any[];
            eventSource = defaults.find((e) => e.slug === slug) ?? null;
            if (!eventSource) {
                // try local stored events
                try {
                    const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');
                    const raw = await fs.readFile(DATA_FILE, 'utf8');
                    const stored = JSON.parse(raw) as any[];
                    const normalize = (text: string) =>
                        text
                            .toString()
                            .toLowerCase()
                            .trim()
                            .replace(/&/g, ' and ')
                            .replace(/[^a-z0-9\s-]/g, '')
                            .replace(/\s+/g, '-')
                            .replace(/-+/g, '-');
                    eventSource = stored.find((e) => String(e.slug) === slug || String(e._id) === slug || normalize(e.title || '') === slug) ?? null;
                } catch (e) {
                    // ignore
                }
            }
        }

        if (!eventSource) return notFound();

        const { description, image, location, date, time, mode, audience, agenda = [], overview = '', tags = [], organizer } = eventSource;

        const similarEvents: any[] = await getSimilarEventBySlug(slug).catch(() => []);

    // TODO: Replace with real bookings count when available
    const bookings = 10;

    return (
    <section id='event'>
        <div className="header">
            <h1>Event Description</h1>
            <p className="mt-2" >{description}</p>
        </div>
        
        <div className="details"> 
            <div className="content">
                <Image src={image} alt="Event Banner" width={1000} height={1000} className="banner" />
                <section className= 'flex-col-gap-2'>
                    <h2>Overview</h2>
                    <p>{overview}</p>
                </section>

                <section className="flex-col-gap-2">
                    <h2>Event Details</h2>
                    
                        <EventDetailItem icon="/icons/calendar.svg" alt="date" label={date} />
                        <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
                        <EventDetailItem icon="/icons/pin.svg" alt="time" label={location} />
                        <EventDetailItem icon="/icons/mode.svg" alt="model" label={mode} />
                        <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />
                    
                </section>
                <EventAgenda agendaItems={agenda} />
                
                <section className="flex-col-gap-2">
                    <h2>The Organizer</h2>
                    <p>{organizer}</p>
                </section>
                <EventTags tags={tags} />
              
            </div>

            <aside className="booking">
                <div className="signup-card">
                    <h2>Book Your Spot</h2>
                    {bookings > 0 ? (
                        <p className="text-sm">Join {bookings} people who have already booked their spot</p>
                    ) : (
                        <p className="text-sm">Be the frist to book your spot</p>
                    )}
                   <BookEvent />
                </div>
            </aside>
            </div>
            <div className="flex w-full flex-col gap-4 pt-20">
                <h2>Similar Events</h2>
                <div className="events">
                    {similarEvents.length > 0 ? (
                        similarEvents.map((event: any) => (
                            <EventCard
                                key={event.slug || event._id}
                                title={event.title}
                                image={event.image}
                                slug={event.slug}
                                location={event.location}
                                date={event.date}
                                time={event.time}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">No similar events found.</p>
                    )}
                </div>
            </div>
        </section>
  ) 
}

export default EventDetailsPage