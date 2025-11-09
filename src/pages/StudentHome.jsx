import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StudentHome() {
  const [events, setEvents] = useState([]);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  // ✅ Fetch Events
  useEffect(() => {
    api
      .get("/events")
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  // ✅ GSAP Animations
  useEffect(() => {
    // Clean up old triggers (prevent flicker)
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // 🪄 Heading Animation
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      }
    );

    // 🎬 Staggered card animation
    if (cardsRef.current.length) {
      gsap.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
          rotateX: 8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: {
            amount: 0.8, // smooth cascade
            from: "start",
          },
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [events]);

  return (
    <div className="relative min-h-screen text-gray-100 overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#13131a] to-[#1c1c24]">
      {/* 🌌 Glowing Gradient Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-700/30 via-transparent to-transparent blur-3xl animate-gradientFlow"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent blur-3xl animate-gradientFlow delay-700"></div>

      <div className="relative z-10 px-6 py-16">
        {/* 🏷️ Title */}
        <h1
          ref={headingRef}
          className="text-5xl sm:text-6xl font-extrabold text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 bg-clip-text text-transparent mb-14 tracking-tight drop-shadow-[0_0_15px_rgba(139,92,246,0.25)]"
        >
          Upcoming Events ✨
        </h1>

               {/* 🎟️ Events Grid */}
        {events.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No events available right now. Check back later!
          </p>
        ) : (
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event, i) => (
              <div
                key={event._id}
                ref={(el) => (cardsRef.current[i] = el)}
                className="transform transition-transform hover:-translate-y-2 hover:scale-[1.02] duration-300"
              >
                <div className="rounded-2xl bg-gray-800/60 border border-white/10 overflow-hidden shadow-lg hover:shadow-indigo-500/30 transition-all duration-500 backdrop-blur-md">
                  <EventCard event={event} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
