import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const formRef = useRef(null);

  useEffect(() => {
    // Subtle entrance animation
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
      }
    );
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.user, res.data.role);
      navigate(res.data.role === "student" ? "/student" : "/club");
      alert("🎉 Registration successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen overflow-hidden bg-gradient-to-br from-[#0a0f14] via-[#0f1c24] to-[#10212b] text-white">
      {/* Subtle background glow animation */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-teal-500/20 to-blue-500/20 blur-[140px] rounded-full animate-light-move"></div>

      {/* Registration form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-8 w-[380px]"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
          Create Account ✨
        </h2>

        <input
          name="name"
          placeholder="Full Name / Club Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-6 p-3 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="student" className="text-black">
            Student
          </option>
          <option value="club" className="text-black">
            Club
          </option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-teal-400/30"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-white/70 mt-5">
          Already have an account?{" "}
          <span
            className="text-teal-400 hover:underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
