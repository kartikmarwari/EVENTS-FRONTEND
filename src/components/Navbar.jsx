import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoClick = () => {
    if (!user) navigate("/");
    else if (role === "student") navigate("/student");
    else if (role === "club") navigate("/club");
  };

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50
      backdrop-blur-md bg-[#0f0f11]/80 border-b border-gray-800
      px-8 py-4 flex justify-between items-center text-gray-200"
    >
      {/* Logo */}
      <h1
        onClick={handleLogoClick}
        className="text-2xl font-bold tracking-tight cursor-pointer text-gray-100 hover:text-white transition-colors duration-200"
      >
            JIIT<span className="text-indigo-400">Events</span>
      </h1>

      {/* Navigation */}
      {!user ? (
        <div className="flex gap-8 text-sm font-medium">
          <Link
            to="/"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            Register
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-8 text-sm font-medium">
          {role === "club" && (
            <>
              <Link to="/club" className="nav-link">
                Events
              </Link>
              <Link to="/create-event" className="nav-link">
                Create
              </Link>
              <Link to="/my-events" className="nav-link">
                My Events
              </Link>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </>
          )}

          {role === "student" && (
            <>
              <Link to="/registered-events" className="nav-link">
                Registered events
              </Link>
              
            </>
          )}

          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-1.5 text-sm font-medium rounded-md 
            border border-gray-700 hover:border-indigo-400
            hover:text-indigo-400 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
