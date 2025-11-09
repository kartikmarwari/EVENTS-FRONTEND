import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [announcements, setAnnouncements] = useState([]); // ✅ declared
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const { registerEvent, registeredEvents } = useAuth();
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const btnRef = useRef(null);

  // fetch single event from all events (your API returns all events at /events)
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get("/events");
        const selected = res.data.find((e) => e._id === id);
        setEvent(selected || null);
      } catch (err) {
        console.error("Error fetching event:", err);
        setEvent(null);
      }
    };
    fetchEvent();
  }, [id]);

  // fetch announcements for this event
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const res = await api.get(`/announcements/${id}`);
        setAnnouncements(res.data || []);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    if (id) fetchAnnouncements();
  }, [id]);

  // GSAP animations
  useEffect(() => {
    if (!event) return;
    // clear older triggers (prevent flicker)
    ScrollTrigger.getAll().forEach((t) => t.kill());

    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });

    gsap.fromTo(
      "body",
      { backgroundColor: "#0b1020" },
      { backgroundColor: "#ffffff00", duration: 1.2, ease: "power1.inOut" }
    );

    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.0 }
    )
      .fromTo(
        imgRef.current,
        { opacity: 0, scale: 1.05, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.0 },
        "-=0.6"
      )
      .fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9 },
        "-=0.8"
      )
      .fromTo(
        btnRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6 },
        "-=0.4"
      );

    gsap.to(imgRef.current, {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: imgRef.current,
        scrub: true,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [event]);

  if (!event) return <p className="text-center mt-10 text-gray-400">Loading event...</p>;

  // determine registration from context (fallback to false)
  const isRegistered = Array.isArray(registeredEvents) && registeredEvents.includes(event._id);

  // open google form then register record in backend
  const handleRegister = async (ev) => {
    try {
      if (ev.formLink) {
        // open form in new tab
        window.open(ev.formLink, "_blank");
      } else {
        alert("No registration form provided for this event.");
        return;
      }

      // inform backend (creates Registration document) — backend will prevent duplicates
      await api.post("/registrations", { eventId: ev._id });
      registerEvent(ev._1d || ev._id); // local state update using context helper
      alert("🎉 You are now marked as registered for this event!");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err);
      alert(err.response?.data?.message || "❌ Failed to register");
    }
  };

  return (
    <div className="relative min-h-screen py-12 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_20%_10%,rgba(99,102,241,0.08),transparent_35%)]" />

      <div
        ref={containerRef}
        className="relative max-w-4xl mx-auto bg-gray-900/60 backdrop-blur-md border border-white/10 shadow-2xl rounded-3xl overflow-hidden"
      >
        <div className="overflow-hidden">
          <img
            ref={imgRef}
            src={event.image || "https://via.placeholder.com/900x400?text=No+Image"}
            alt={event.title}
            className="w-full h-80 object-cover rounded-t-3xl transform transition-transform duration-700 hover:scale-105"
            onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/900x400?text=No+Image")}
          />
        </div>

        <div ref={textRef} className="p-8 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold">{event.title}</h1>
          <p className="text-gray-300">{event.description}</p>

          <div className="text-gray-400 text-sm">
            📍 {event.venue} •{" "}
            {event.date ? new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Date TBD"}{" "}
            • {event.time || "Time TBD"}
          </div>
        </div>

        <div ref={btnRef} className="p-8 text-center">
          {isRegistered ? (
            <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md cursor-not-allowed w-full sm:w-auto">
              ✅ Already Registered
            </button>
          ) : (
            <button
              onClick={() => handleRegister(event)}
              className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg w-full sm:w-auto hover:scale-[1.02] transition-transform"
            >
              Register Now
            </button>
          )}
        </div>

        {/* Announcements Section */}
        <div className="p-8 border-t border-white/10 bg-gray-900/50">
          <h2 className="text-2xl font-bold text-indigo-300 mb-4">📢 Announcements</h2>

          {loadingAnnouncements ? (
            <p className="text-gray-400">Loading announcements…</p>
          ) : announcements.length === 0 ? (
            <p className="text-gray-400">No announcements yet.</p>
          ) : (
            <ul className="space-y-4">
              {announcements.map((a) => (
                <li key={a._id} className="bg-gray-800/60 p-4 rounded-lg border border-white/5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="text-white/90">{a.message}</p>
                      {a.file && (
                        <a
                          href={a.file}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 text-sm text-indigo-400 hover:underline"
                        >
                          View attachment
                        </a>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Posted by {a.postedBy?.clubName || "Club"} •{" "}
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;