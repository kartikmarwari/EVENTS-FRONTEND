import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import AllClubs from "./pages/AllClubs";
import Register from "./pages/Register";
import ClubAnnouncements from "./pages/ClubAnnouncements";
import StudentHome from "./pages/StudentHome";
import ClubHome from "./pages/ClubHome";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import Dashboard from "./pages/Dashboard";
import RegisteredEvents from "./pages/RegisteredEvents";
<Route path="/club" element={<ClubHome />} />
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student" element={<StudentHome />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/club" element={<ClubHome />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route
  path="/club/event/:eventId/announcements"
  element={<ClubAnnouncements />}
/>



<Route path="/clubs" element={<AllClubs />} />

<Route path="/registered-events" element={<RegisteredEvents />} />
<Route path="/my-events" element={<MyEvents />} />
<Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
