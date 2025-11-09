import { useEffect, useState } from "react";
import api from "../api/axios";
import EventCard from "../components/EventCard";

export default function RegisteredEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const res = await api.get("/registrations/my");
        console.log("✅ My Registrations:", res.data);

        // Extract valid event objects
        const validEvents = res.data
          .map((r) => ({
            ...r.event,
            registeredAt: r.registeredAt,
          }))
          .filter((e) => e && e._id);

        setEvents(validEvents);
      } catch (err) {
        console.error("Error fetching registered events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegisteredEvents();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-black">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black py-14 px-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-center mb-12 text-indigo-300 drop-shadow-md">
          My Registered Events 🗓️
        </h1>

        {/* No Events Case */}
        {events.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 text-center border border-white/20 shadow-xl max-w-xl mx-auto">
            <p className="text-gray-300 text-lg mb-2">
              You haven’t registered for any events yet.
            </p>
            <p className="text-indigo-400">
              Discover and join upcoming events today! 🚀
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <EventCard event={event} />
                 
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}