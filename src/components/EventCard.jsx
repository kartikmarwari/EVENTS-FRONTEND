import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

export default function EventCard({ event }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/event/${event._id}`)}
      className="cursor-pointer bg-gradient-to-br from-[#1a1a1f] to-[#111113] 
                 border border-white/10 backdrop-blur-lg rounded-2xl 
                 shadow-lg hover:shadow-xl hover:-translate-y-1 
                 transition-all duration-300 overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={
            event.image ||
            "https://via.placeholder.com/400x300?text=Event+Coming+Soon"
          }
          alt={event.title}
          className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

        {/* Event title overlay */}
        <h3 className="absolute bottom-4 left-4 text-lg sm:text-xl font-semibold text-white tracking-tight drop-shadow-md">
          {event.title?.length > 35
            ? event.title.substring(0, 35) + "..."
            : event.title}
        </h3>
      </div>

      {/* Event Info */}
      <div className="p-5">
        <p className="text-gray-400 text-sm leading-snug mb-3 line-clamp-2">
          {event.description
            ? event.description.substring(0, 80) + "..."
            : "No description available."}
        </p>

        <div className="flex justify-between items-end mt-4">
          <div className="flex flex-col">
            <span className="font-medium text-gray-200 text-sm">
              📍 {event.venue || "Venue TBD"}
            </span>
            <span className="text-xs text-gray-500">
              {event.date
                ? new Date(event.date).toLocaleDateString()
                : "Date TBD"}{" "}
              • {event.time || "Time TBD"}
            </span>
          </div>
          <span className="text-indigo-400 font-semibold text-sm group-hover:underline">
            View →
          </span>
        </div>
      </div>
    </div>
  );
}
