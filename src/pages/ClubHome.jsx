import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import api from "../api/axios";
import EventCard from "../components/EventCard";

export default function ClubHome() {
  const [events, setEvents] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    api.get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0d] via-[#14141a] to-[#1e1e25] py-16 px-6 text-white"
    >
      <h1 className="text-4xl font-extrabold text-center mb-12 text-indigo-300 tracking-tight">
        All College Events 🎭
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No events yet.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
