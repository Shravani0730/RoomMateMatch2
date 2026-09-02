function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        <div className="footer-brand">
          <h2>🏠 RoomMate Match</h2>
          <p>
            Find a roommate who matches your lifestyle,
            not just your budget.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
        </div>

        <div className="footer-links">
          <h3>Account</h3>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 RoomMate Match. All rights reserved.</p>
      </div>

    </footer>
  );
}

export default Footer;