import { notFound } from "next/navigation";
import Image from "next/image";
import { ImageDown } from "lucide-react";
import BookEvent from "@/components/Book";
import { getSimilarEventBySlug } from "@/lib/actions/eventactions";
import { IEvent } from "@/database/event.model";
import EventCard from "@/components/EventCard";


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
    const {slug} = await params;
    const request  = await fetch(`${BASE_URL}/api/events/${slug}`, { cache: "no-store" });
    const {event: { description, image, location, date, time, mode, audience, agenda, overview, tags,organizer}} = await request.json();

    if (!description) return notFound();
    
    // Fetch similar events inside the function
    const similarEvents: IEvent[] = await getSimilarEventBySlug(slug);

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
                    {similarEvents.length > 0 && similarEvents.map((event: IEvent) => (
                        <EventCard key={event.id} {...event} />
                    ))}
                

                </div>

            </div>
        </section>
  ) 
}

export default EventDetailsPage