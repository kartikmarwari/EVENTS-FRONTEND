import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { gsap } from "gsap";
 
export default function ClubAnnouncements() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const listRef = useRef([]);

  // ✅ Fetch event info + announcements
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, annRes] = await Promise.all([
          api.get("/events/my", { withCredentials: true }),
          api.get(`/announcements/${eventId}`),
        ]);
        const selected = eventRes.data.find((e) => e._id === eventId);
        setEvent(selected || {});
        setAnnouncements(annRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [eventId]);

  // ✅ GSAP animation for entrance
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  // ✅ Create announcement
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return alert("Message cannot be empty!");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("message", message);
      if (file) formData.append("file", file);

      await api.post("/announcements", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("✅ Announcement posted!");
      setMessage("");
      setFile(null);

      // Reload announcements
      const res = await api.get(`/announcements/${eventId}`);
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error creating announcement:", err);
      alert(err.response?.data?.message || "❌ Failed to post announcement");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete announcement
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/announcements/${id}`, { withCredentials: true });
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      alert("🗑️ Deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete announcement");
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0d] via-[#14141a] to-[#1e1e25] text-white py-14 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-300">
          📢 Manage Announcements
        </h1>

        {event && (
          <h2 className="text-xl font-semibold text-center mb-10 text-gray-300">
            Event: <span className="text-indigo-400">{event.title}</span>
          </h2>
        )}

        {/* ✍️ New Announcement Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 p-6 rounded-2xl shadow-xl border border-white/10 mb-10 space-y-4"
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your announcement here..."
            className="w-full bg-transparent border border-white/20 rounded-lg p-3 h-28 resize-none focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-gray-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold text-lg transition-all disabled:bg-gray-500"
          >
            {loading ? "Posting..." : "Post Announcement"}
          </button>
        </form>

        {/* 📋 Announcements List */}
        <div className="space-y-6">
          {announcements.length === 0 ? (
            <p className="text-center text-gray-400">
              No announcements yet for this event.
            </p>
          ) : (
            announcements.map((a, i) => (
              <div
                key={a._id}
                ref={(el) => (listRef.current[i] = el)}
                className="bg-white/10 border border-white/10 p-5 rounded-2xl shadow-md relative overflow-hidden group"
              >
                <p className="text-white/90">{a.message}</p>
                {a.file && (
                  <a
                    href={a.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 underline text-sm mt-2 inline-block"
                  >
                    View attachment
                  </a>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Posted {new Date(a.createdAt).toLocaleString()}
                </p>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="absolute top-3 right-3 bg-red-500/70 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  🗑 Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
