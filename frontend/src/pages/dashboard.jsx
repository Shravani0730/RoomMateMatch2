import { Link } from "react-router-dom";
import { matches } from "../data/mockdata";

function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* ================= NAVBAR ================= */}

      <header className="dashboard-navbar">

        <Link to="/" className="dashboard-logo">
          🏠 <span>RoomMate</span> Match
        </Link>

        <div className="dashboard-nav-right">

          {/* NOTIFICATIONS */}
          <Link
            to="/notifications"
            className="notification"
            title="Notifications"
          >
            🔔
          </Link>

          {/* PROFILE */}
          <Link
            to="/profile"
            className="dashboard-user"
            title="My Profile"
          >
            <div className="dashboard-avatar">
              👩🏻
            </div>

            <div>
              <strong>Shravani</strong>
              <span>Student</span>
            </div>
          </Link>

        </div>

      </header>


      {/* ================= CONTENT ================= */}

      <main className="dashboard-content">


        {/* ================= WELCOME ================= */}

        <section className="dashboard-welcome">

          <div>

            <span>
              YOUR DASHBOARD
            </span>

            <h1>
              Hi Shravani! 👋
            </h1>

            <p>
              Here's what's happening with your roommate search.
            </p>

          </div>

          <Link
            to="/quiz"
            className="dashboard-quiz-btn"
          >
            ✨ Update Lifestyle
          </Link>

        </section>


        {/* ================= STATS ================= */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              💕
            </div>

            <div>
              <span>
                Compatibility
              </span>

              <strong>
                92%
              </strong>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>
              <span>
                Potential Matches
              </span>

              <strong>
                {matches.length}
              </strong>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              💬
            </div>

            <div>
              <span>
                Messages
              </span>

              <strong>
                3
              </strong>
            </div>

          </div>

        </section>


        {/* ================= MATCHES ================= */}

        <section className="matches-section">

          <div className="section-title-row">

            <div>

              <span>
                BEST MATCHES
              </span>

              <h2>
                People you may match with
              </h2>

            </div>

            <Link
              to="/matches"
              className="view-all-btn"
            >
              View all →
            </Link>

          </div>


          <div className="match-grid">

            {matches.slice(0, 3).map((match, index) => (

              <div
                className="match-card"
                key={match.id}
              >

                {/* CARD TOP */}

                <div className="match-card-top">

                  <div
                    className={`match-avatar ${
                      index === 1
                        ? "blue-avatar"
                        : index === 2
                        ? "purple-avatar"
                        : ""
                    }`}
                  >
                    {match.avatar}
                  </div>


                  <div className="match-percentage">

                    <strong>
                      {match.compatibility}%
                    </strong>

                    <span>
                      Compatible
                    </span>

                  </div>

                </div>


                {/* USER INFO */}

                <h3>
                  {match.name}, {match.age}
                </h3>

                <p className="match-location">
                  📍 {match.location} • {match.role}
                </p>


                {/* TAGS */}

                <div className="match-tags">

                  {match.sleep && (
                    <span>
                      🌙 {match.sleep}
                    </span>
                  )}

                  {match.cleanliness && (
                    <span>
                      🧹 {match.cleanliness}
                    </span>
                  )}

                  {match.social && (
                    <span>
                      🎉 {match.social}
                    </span>
                  )}

                </div>


                {/* BUTTON */}

                <Link
                  to={`/matches/${match.id}`}
                  className="match-profile-btn"
                >
                  View Compatibility →
                </Link>

              </div>

            ))}

          </div>

        </section>


        {/* ================= LIFESTYLE ================= */}

        <section className="lifestyle-section">

          <div className="section-title-row">

            <div>

              <span>
                YOUR LIFESTYLE
              </span>

              <h2>
                My Preferences
              </h2>

            </div>

            <Link
              to="/profile"
              className="edit-preferences"
            >
              ✏️ Edit Preferences
            </Link>

          </div>


          <div className="lifestyle-grid">

            <div>
              <span>🌙 Sleep Schedule</span>
              <strong>Night Owl</strong>
            </div>

            <div>
              <span>🧹 Cleanliness</span>
              <strong>Very Clean</strong>
            </div>

            <div>
              <span>🎉 Social Life</span>
              <strong>Balanced</strong>
            </div>

            <div>
              <span>🍳 Food</span>
              <strong>Cooking</strong>
            </div>

            <div>
              <span>📚 Study Environment</span>
              <strong>Very Quiet</strong>
            </div>

            <div>
              <span>🏠 Guests</span>
              <strong>Sometimes</strong>
            </div>

          </div>

        </section>


      </main>

    </div>
  );
}

export default Dashboard;