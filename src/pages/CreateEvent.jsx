import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import api from "../api/axios";

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    formLink: "",
    googleSheetLink: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      await api.post("/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Event created successfully!");
      setForm({
        title: "",
        description: "",
        venue: "",
        date: "",
        time: "",
        formLink: "",
        googleSheetLink: "",
      });
      setImage(null);
    } catch (err) {
      alert(err.response?.data?.error || "❌ Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-12 bg-gradient-to-br from-[#0a0a0d] via-[#14141a] to-[#1e1e25] text-white">
      <div
        ref={containerRef}
        className="bg-white/10 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-10 w-full max-w-2xl"
      >
        <h2 className="text-4xl font-extrabold text-center mb-10 text-indigo-300">
          🎉 Create New Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { name: "title", label: "Event Title", placeholder: "Tech Fest 2025" },
            { name: "venue", label: "Venue", placeholder: "College Auditorium / Hall" },
            { name: "formLink", label: "Google Form Link", placeholder: "https://forms.gle/..." },
            { name: "googleSheetLink", label: "Google Sheet Link", placeholder: "https://docs.google.com/spreadsheets/d/..." },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block mb-1 font-semibold">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          ))}

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter event details"
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 h-28 resize-none focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Time</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-semibold">Event Poster</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full bg-white/10 border border-white/20 rounded-lg p-3 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:bg-indigo-400/90 hover:file:bg-indigo-500 file:text-black cursor-pointer"
            />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-4 w-40 h-40 object-cover rounded-xl border border-white/30"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-xl font-semibold text-lg transition-all disabled:bg-gray-500"
          >
            {loading ? "Creating Event..." : "🚀 Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
