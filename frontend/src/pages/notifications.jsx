import { Link } from "react-router-dom";

function Notifications() {
  return (
    <div className="inner-page">

      {/* NAVBAR */}
      <header className="inner-navbar">

        <Link to="/" className="dashboard-logo">
          🏠 <span>RoomMate</span> Match
        </Link>

        <Link to="/dashboard" className="nav-back">
          ← Dashboard
        </Link>

      </header>


      {/* PAGE */}
      <main className="notifications-page">

        <div className="notifications-header">

          <div>
            <span className="profile-label">
              NOTIFICATIONS
            </span>

            <h1>Your Updates</h1>

            <p>
              Stay updated with your roommate activity.
            </p>
          </div>

          <button className="mark-read-btn">
            Mark all as read
          </button>

        </div>


        {/* NOTIFICATION LIST */}

        <section className="notifications-list">

          <div className="notification-card unread">

            <div className="notification-icon">
              💕
            </div>

            <div className="notification-content">

              <h3>
                New roommate match!
              </h3>

              <p>
                You have a new highly compatible roommate match.
              </p>

              <span>
                Just now
              </span>

            </div>

          </div>


          <div className="notification-card">

            <div className="notification-icon">
              💬
            </div>

            <div className="notification-content">

              <h3>
                New message
              </h3>

              <p>
                Someone sent you a message about your roommate profile.
              </p>

              <span>
                2 hours ago
              </span>

            </div>

          </div>


          <div className="notification-card">

            <div className="notification-icon">
              ❤️
            </div>

            <div className="notification-content">

              <h3>
                Profile liked
              </h3>

              <p>
                Someone is interested in connecting with you.
              </p>

              <span>
                Yesterday
              </span>

            </div>

          </div>


          <div className="notification-card">

            <div className="notification-icon">
              🎉
            </div>

            <div className="notification-content">

              <h3>
                Profile completed
              </h3>

              <p>
                Your lifestyle profile is ready for matching.
              </p>

              <span>
                2 days ago
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Notifications;