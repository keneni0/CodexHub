import { notFound } from "next/navigation";
import Image from "next/image";
import { ImageDown } from "lucide-react";
import BookEvent from "@/components/Book";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon,alt,label}: {icon:string,alt:string,label:string}) => (
    <div className="flex-row-gap-2 items-center ">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
    </div>
)
const bookings = 10;

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
        </section>
  ) 
}
export default EventDetailsPage