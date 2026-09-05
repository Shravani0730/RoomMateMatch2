import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogout = () => {
    // Remove logged-in user information
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("chatUserId");

    // Update navbar immediately
    setIsLoggedIn(false);

    // Redirect to home page
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="logo">
          🏠 <span>RoomMate</span> Match
        </Link>

        {/* NAVIGATION */}
        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <a href="/#how-it-works">
            How It Works
          </a>

          <a href="/#features">
            Features
          </a>

          {isLoggedIn ? (
            <>
              {/* DASHBOARD */}
              <Link to="/dashboard">
                Dashboard
              </Link>

              {/* NOTIFICATIONS */}
              <Link
                to="/notifications"
                className="notification-nav"
              >
                🔔
              </Link>

              {/* PROFILE */}
              <Link to="/profile">
                Profile
              </Link>

              {/* LOGOUT */}
              <button
                type="button"
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* NOTIFICATIONS */}
              <Link
                to="/notifications"
                className="notification-nav"
              >
                🔔
              </Link>

              {/* LOGIN */}
              <Link
                to="/login"
                className="login-btn"
              >
                Login
              </Link>

              {/* REGISTER */}
              <Link
                to="/register"
                className="register-btn"
              >
                Get Started
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;