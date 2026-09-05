import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

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
import ConnectedRoommates from "./pages/connectedroommates";

import ProtectedRoute from "./components/protectedroute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* QUIZ */}
        <Route
          path="/quiz"
          element={<Quiz />}
        />


        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route element={<ProtectedRoute />}>

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* MATCHES */}
          <Route
            path="/matches"
            element={<Matches />}
          />

          {/* MATCH DETAILS */}
          <Route
            path="/matches/:id"
            element={<MatchDetails />}
          />

          {/* CHAT */}
          <Route
            path="/chat"
            element={<Chat />}
          />

          {/* NOTIFICATIONS */}
          <Route
            path="/notifications"
            element={<Notifications />}
          />

          {/* CONNECTED ROOMMATES */}
          <Route
            path="/connected"
            element={<ConnectedRoommates />}
          />

        </Route>


        {/* =========================
            FALLBACK
        ========================= */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;