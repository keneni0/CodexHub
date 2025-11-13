import ExploreBtn from "@/components/ExploreBtn";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import events from "@/lib/constants";


const page = () => {
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
      {events.map((event)=>(
        <li key={event.title}>
            <EventCard
              title={event.title}
              image={event.image}
              slug={event.slug || ""}
              location={event.location || ""}
              date={event.date || ""}
              time={event.time || ""}
            />
         
        </li>
      ))}
      
    </ul>
  </div> 
    </section>
  )
}

export default page