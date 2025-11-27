import { notFound } from "next/navigation";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsPage = async ({params}:{params: Promise<{slug: string}>}) => {
    const {slug} = await params;
    const request  = await fetch(`${BASE_URL}/api/events/${slug}`);
    const {event: { description, image, location, date, time, mode, audience, agenda, overview, tags}} = await request.json();

    if (!description) return notFound();
    return (
    <section id='event'>
        <div className="header">
            <h1>Event Description</h1>
            <p className="mt-2" >{description}</p>
        </div>
        
        <div className="details"> 
            <aside className="content">
                <Image src={image} alt="Event Banner" width={1000} height={1000} className="banner" />
                <section className= 'flex-col-gap-2'>
                    <h2>Overview</h2>
                    <p>{overview}</p>
                </section>
            </aside>

            <aside className="booking">
                <p className="text-lg font-semibold">Book Event</p>
            </aside>
            </div>
        </section>
  ) 
}
export default EventDetailsPage