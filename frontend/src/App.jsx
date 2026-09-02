import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Quiz from "./pages/quiz";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Matches from "./pages/matches";
import MatchDetails from "./pages/matchdetails";
import Chat from "./pages/chat";
import Notifications from "./pages/notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* QUIZ */}
        <Route path="/quiz" element={<Quiz />} />

        {/* MAIN PAGES */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/matches" element={<Matches />} />

        {/* MATCH DETAILS */}
        <Route
          path="/matches/:id"
          element={<MatchDetails />}
        />

        {/* CHAT */}
        <Route path="/chat" element={<Chat />} />

        {/* NOTIFICATIONS */}
        <Route
          path="/notifications"
          element={<Notifications />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;