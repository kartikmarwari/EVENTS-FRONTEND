import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();
  const { login } = useAuth();

  const formRef = useRef(null);

  useEffect(() => {
    // Simple entrance animation
    gsap.fromTo(
      formRef.current,
      { opacity: 0, scale: 0.9, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login",Payload, { email, password, role });
      login(res.data.user, res.data.role);
      navigate(res.data.role === "student" ? "/student" : "/club");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden bg-gradient-to-br from-[#0f0f12] via-[#14151b] to-[#1b1c23] text-white">
      
      {/* Subtle animated light aura */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-indigo-600/20 to-purple-600/20 blur-[150px] rounded-full animate-light-move"></div>

      {/* Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 shadow-xl rounded-2xl p-8 w-[380px]"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Welcome Back 👋
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="student" className="text-black">Student</option>
          <option value="club" className="text-black">Club</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/30"
        >
          Login
        </button>

        <p className="text-center text-white/70 mt-5">
          Don’t have an account?{" "}
          <span
            className="text-indigo-400 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
