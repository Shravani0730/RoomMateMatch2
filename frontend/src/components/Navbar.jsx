import { Link } from "react-router-dom";

function Navbar() {
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

          {/* NOTIFICATIONS */}
          <Link to="/notifications" className="notification-nav">
            🔔
          </Link>

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;