import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import EventCard from "../components/EventCard";
import { gsap } from "gsap";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const navigate = useNavigate(); // ✅ moved inside component

  // ✅ Fetch all hosted events for the logged-in club
  const fetchMyEvents = async () => {
    try {
      const res = await api.get("/events/my", { withCredentials: true });
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching club events:", err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // ✅ Delete event function
  const handleDelete = async (eventId, title) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the event "${title}"?`
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      await api.delete(`/events/${eventId}`, { withCredentials: true });
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      alert("✅ Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert(err.response?.data?.message || "❌ Failed to delete event");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Animate container and cards
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    if (events.length) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 0.3,
          ease: "power3.out",
        }
      );
    }
  }, [events]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0d] via-[#14141a] to-[#1e1e25] py-16 px-6 text-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-center mb-12 text-indigo-300 tracking-tight">
          My Hosted Events 🎪
        </h1>

        {/* No Events */}
        {events.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg max-w-xl mx-auto text-center p-10 transition-all">
            <p className="text-gray-300 text-lg">
              You haven’t hosted any events yet.
            </p>
            <p className="mt-3 text-indigo-400 font-medium">
              Create one and make your mark on campus 🚀
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.map((event, index) => (
              <div
                key={event._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="relative group transform hover:scale-105 hover:-translate-y-1 transition-transform duration-300"
              >
                {/* Event Card */}
                <EventCard event={event} />

                {/* 📢 Manage Announcements Button */}
                <button
                  onClick={() =>
                    navigate(`/club/event/${event._id}/announcements`)
                  }
                  className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
                >
                  📢 Manage Announcements
                </button>

                {/* 🗑 Delete Button */}
                <button
                  onClick={() => handleDelete(event._id, event.title)}
                  disabled={loading}
                  className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md transition-all duration-200"
                >
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
