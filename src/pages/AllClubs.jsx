import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AllClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await api.get("/clubs");
        setClubs(res.data);
      } catch (err) {
        console.error("Error fetching clubs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading clubs...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-600">
        ✨ Explore JIIT Clubs
      </h1>

      {clubs.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No clubs registered yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {clubs.map((club) => (
            <div
              key={club._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center text-center border"
            >
              {club.logo ? (
                <img
                  src={club.logo}
                  alt={club.clubName}
                  className="w-24 h-24 rounded-full mb-4 object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 flex items-center justify-center text-gray-500 text-2xl font-bold">
                  {club.clubName[0]}
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {club.clubName}
              </h3>

              <p className="text-gray-600 text-sm mb-4">
                {club.description || "A vibrant student club of JIIT."}
              </p>

              {club.website ? (
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Visit Website 🌐
                </a>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  No website link available
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
