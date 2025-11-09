import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [sheetData, setSheetData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // ✅ Animate entrance
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    const fetchMyEvents = async () => {
      try {
        const res = await api.get("/events/my", { withCredentials: true });
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching my events:", err);
      }
    };
    fetchMyEvents();
  }, []);

  // ✅ Function to extract sheet ID from link
  const extractSheetId = (link) => {
    const match = link.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  // ✅ Fetch the first sheet name dynamically
  const fetchFirstSheetName = async (sheetId) => {
    try {
      const metaRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${
          import.meta.env.VITE_GOOGLE_API_KEY
        }`
      );
      const meta = await metaRes.json();
      const sheetName = meta.sheets?.[0]?.properties?.title;
      return sheetName || "Sheet1"; // fallback
    } catch (err) {
      console.error("Error fetching sheet name:", err);
      return "Sheet1";
    }
  };

  // ✅ Fetch registrations automatically from detected sheet
  const fetchRegistrations = async (googleSheetLink) => {
    try {
      setLoading(true);
      setSheetData([]);

      const sheetId = extractSheetId(googleSheetLink);
      if (!sheetId) {
        alert("Invalid Google Sheet link!");
        return;
      }

      const sheetName = await fetchFirstSheetName(sheetId);

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
          sheetName
        )}?key=${import.meta.env.VITE_GOOGLE_API_KEY}`
      );
      const data = await res.json();

      if (data.values) {
        setSheetData(data.values);
      } else {
        setSheetData([]);
      }
    } catch (error) {
      console.error("Error fetching Google Sheet data:", error);
      setSheetData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0d] via-[#14141a] to-[#1e1e25] py-16 px-6 text-white"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-indigo-300">
          {user?.name || "Club"} Dashboard 📊
        </h1>

        {/* ✅ Select Event Dropdown */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto mb-10">
          <label className="block mb-3 text-lg font-semibold text-gray-200">
            Select an Event:
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => {
              setSelectedEvent(e.target.value);
              const event = events.find((ev) => ev._id === e.target.value);
              if (event?.googleSheetLink) {
                fetchRegistrations(event.googleSheetLink);
              } else {
                setSheetData([]);
              }
            }}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Choose an Event --</option>
            {events.map((event) => (
              <option key={event._id} value={event._id} className="text-black">
                {event.title}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Table Section */}
        {loading ? (
          <p className="text-center text-indigo-300 font-medium animate-pulse">
            Fetching registrations...
          </p>
        ) : sheetData.length > 0 ? (
          <div className="overflow-x-auto bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl">
            <table className="w-full text-left border-collapse text-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-indigo-500 text-white">
                  {sheetData[0].map((header, i) => (
                    <th key={i} className="px-4 py-2 border border-indigo-400/30">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheetData.slice(1).map((row, i) => (
                  <tr key={i} className="hover:bg-white/10 transition">
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-2 border border-gray-700">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-center text-indigo-300 font-semibold">
              Total Registrations: {sheetData.length - 1}
            </p>
          </div>
        ) : (
          selectedEvent && (
            <p className="text-center text-gray-400 mt-8">
              No registration data found.
            </p>
          )
        )}
      </div>
    </div>
  );
}
