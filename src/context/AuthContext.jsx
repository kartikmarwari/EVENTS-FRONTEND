import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true); // 🧠 new — to handle initial state

  // ✅ LOGIN
 const login = async (userData, userRole) => {
  setUser(userData);
  setRole(userRole);

  // ✅ Wait for backend to confirm cookie is active before loading registrations
  setTimeout(async () => {
    try {
      const check = await api.get("/auth/check"); // verifies cookie
      if (check.data.user) {
        await loadRegisteredEvents();
      }
    } catch (error) {
      console.warn("Still waiting for cookie to sync...");
    }
  }, 500); // wait a little longer (half second)
};


  // ✅ LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // clear cookie on backend
    } catch {
      console.warn("Logout cleanup failed (probably already logged out)");
    }
    setUser(null);
    setRole(null);
    setRegisteredEvents([]);
  };

  // ✅ REGISTER EVENT LOCALLY
  const registerEvent = (eventId) => {
    setRegisteredEvents((prev) => [...new Set([...prev, eventId])]);
  };

  // ✅ LOAD REGISTERED EVENTS
  const loadRegisteredEvents = async () => {
    try {
      const res = await api.get("/registrations/my");
      const ids = res.data.map((r) => r.event?._id).filter(Boolean);
      setRegisteredEvents(ids);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("⏳ Not authorized yet — cookie might not be ready.");
      } else {
        console.error("Error loading registered events:", err);
      }
    }
  };

  // ✅ CHECK LOGIN STATUS (auto-login from cookie)
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/check");
      if (res.data.user) {
        setUser(res.data.user);
        setRole(res.data.role);
        await loadRegisteredEvents();
      }
    } catch (err) {
      console.log("Not logged in yet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth(); // 🧠 check if cookie already exists on mount
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        registeredEvents,
        login,
        logout,
        registerEvent,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
