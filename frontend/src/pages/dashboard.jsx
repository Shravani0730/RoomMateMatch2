import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [matches, setMatches] = useState([]);
  const [connectedRoommates, setConnectedRoommates] = useState([]);

  const [messageCount, setMessageCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  // =====================================================
  // LOAD ALL DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, [userId, navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // -------------------------------------------------
      // USER
      // -------------------------------------------------

      const userResponse = await fetch(
        `http://localhost:5000/api/users/${userId}`
      );

      if (!userResponse.ok) {
        throw new Error("Unable to load user");
      }

      const userData = await userResponse.json();

      if (!userData.success || !userData.user) {
        localStorage.removeItem("userId");
        navigate("/login");
        return;
      }

      setUser(userData.user);

      // -------------------------------------------------
      // PREFERENCES
      // -------------------------------------------------

      try {
        const response = await fetch(
          `http://localhost:5000/api/preferences/${userId}`
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setPreferences(data.preferences || null);
        } else {
          setPreferences(null);
        }
      } catch (error) {
        console.error("Preferences error:", error);
        setPreferences(null);
      }

      // -------------------------------------------------
      // MATCHES
      // -------------------------------------------------

      loadMatches();

      // -------------------------------------------------
      // CONNECTIONS
      // -------------------------------------------------

      loadConnectedRoommates();

      // -------------------------------------------------
      // MESSAGES
      // -------------------------------------------------

      loadMessageCount();
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD MATCHES
  // =====================================================

  const loadMatches = async () => {
    try {
      setMatchesLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/matches/${userId}`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMatches(data.matches || []);
      } else {
        setMatches([]);
      }
    } catch (error) {
      console.error("Matches error:", error);
      setMatches([]);
    } finally {
      setMatchesLoading(false);
    }
  };

  // =====================================================
  // LOAD CONNECTED ROOMMATES
  // =====================================================

  const loadConnectedRoommates = async () => {
    try {
      setConnectionsLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/connections/${userId}`
      );

      const data = await response.json();

      console.log("Dashboard connections:", data);

      if (!response.ok || !data.success) {
        setConnectedRoommates([]);
        return;
      }

      // -------------------------------------------------
      // ONLY ACCEPTED CONNECTIONS
      // -------------------------------------------------

      const acceptedConnections = (
        data.connections || []
      ).filter(
        (connection) =>
          String(connection.status).toLowerCase() ===
          "accepted"
      );

      // -------------------------------------------------
      // GET OTHER USER ID
      // -------------------------------------------------

      const otherUserIds = acceptedConnections
        .map((connection) => {
          const senderId = Number(connection.sender_id);
          const receiverId = Number(connection.receiver_id);
          const currentId = Number(userId);

          if (senderId === currentId) {
            return receiverId;
          }

          if (receiverId === currentId) {
            return senderId;
          }

          return null;
        })
        .filter(Boolean);

      // -------------------------------------------------
      // REMOVE DUPLICATES
      // -------------------------------------------------

      const uniqueUserIds = [
        ...new Set(otherUserIds),
      ];

      // -------------------------------------------------
      // GET USER DETAILS
      // -------------------------------------------------

      const roommateResults = await Promise.all(
        uniqueUserIds.map(async (roommateId) => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/users/${roommateId}`
            );

            if (!response.ok) {
              return null;
            }

            const data = await response.json();

            if (data.success && data.user) {
              return data.user;
            }

            return null;
          } catch (error) {
            console.error(
              `Failed to load roommate ${roommateId}:`,
              error
            );

            return null;
          }
        })
      );

      setConnectedRoommates(
        roommateResults.filter(Boolean)
      );
    } catch (error) {
      console.error(
        "Connected roommates error:",
        error
      );

      setConnectedRoommates([]);
    } finally {
      setConnectionsLoading(false);
    }
  };

  // =====================================================
  // LOAD MESSAGE COUNT
  // =====================================================

  const loadMessageCount = async () => {
    try {
      setMessagesLoading(true);

      const response = await fetch(
        `http://localhost:5000/api/chat/count/${userId}`
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMessageCount(Number(data.count) || 0);
      } else {
        setMessageCount(0);
      }
    } catch (error) {
      console.error("Messages count error:", error);
      setMessageCount(0);
    } finally {
      setMessagesLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="connected-loading-icon">
          💕
        </div>

        <h2>Loading your dashboard...</h2>

        <p>
          Getting everything ready for you.
        </p>
      </div>
    );
  }

  // =====================================================
  // USER NOT FOUND
  // =====================================================

  if (!user) {
    return null;
  }

  // =====================================================
  // DASHBOARD VALUES
  // =====================================================

  const bestMatch =
    matches.length > 0
      ? Number(matches[0].compatibility) || 0
      : 0;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="dashboard-page">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="dashboard-navbar">

        <Link
          to="/"
          className="dashboard-logo"
        >
          🏠 <span>RoomMate</span> Match
        </Link>

        <div className="dashboard-nav-right">

          <Link
            to="/notifications"
            className="notification"
            title="Notifications"
          >
            🔔
          </Link>

          <Link
            to="/profile"
            className="dashboard-user"
            title="My Profile"
          >

            <div className="dashboard-avatar">
              👩🏻
            </div>

            <div>
              <strong>
                {user.name}
              </strong>

              <span>
                {user.role || "Student"}
              </span>
            </div>

          </Link>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-content">

        {/* =================================================
            WELCOME
        ================================================= */}

        <section className="dashboard-welcome">

          <div>

            <span>
              YOUR DASHBOARD
            </span>

            <h1>
              Hi {user.name}! 👋
            </h1>

            <p>
              Here's what's happening with your
              roommate search.
            </p>

          </div>

          <Link
            to="/quiz"
            className="dashboard-quiz-btn"
          >
            ✨ Update Lifestyle
          </Link>

        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="dashboard-stats">

          {/* BEST COMPATIBILITY */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              💕
            </div>

            <div>

              <span>
                Best Compatibility
              </span>

              <strong>
                {matchesLoading
                  ? "..."
                  : `${bestMatch}%`}
              </strong>

            </div>

          </div>

          {/* POTENTIAL MATCHES */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              👥
            </div>

            <div>

              <span>
                Potential Matches
              </span>

              <strong>
                {matchesLoading
                  ? "..."
                  : matches.length}
              </strong>

            </div>

          </div>

          {/* MESSAGES */}

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              💬
            </div>

            <div>

              <span>
                Messages
              </span>

              <strong>
                {messagesLoading
                  ? "..."
                  : messageCount}
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            CONNECTED ROOMMATES
        ================================================= */}

        <section className="connected-dashboard-section">

          <div className="connected-dashboard-heading">

            <div>

              <span>
                💕 YOUR CONNECTIONS
              </span>

              <h2>
                Connected Roommates
              </h2>

              <p>
                View the roommates you've connected
                with and start a conversation.
              </p>

            </div>

            {connectedRoommates.length > 0 && (
              <Link
                to="/connected"
                className="view-all-btn"
              >
                View all →
              </Link>
            )}

          </div>

          {/* CONNECTION LOADING */}

          {connectionsLoading && (
            <div className="dashboard-loading-small">

              <div>
                💕
              </div>

              <p>
                Loading your connections...
              </p>

            </div>
          )}

          {/* NO CONNECTIONS */}

          {!connectionsLoading &&
            connectedRoommates.length === 0 && (
              <div className="connected-dashboard-empty">

                <div className="connected-dashboard-icon">
                  💕
                </div>

                <h3>
                  No connected roommates yet
                </h3>

                <p>
                  Connect with a potential roommate
                  and accepted connections will
                  appear here.
                </p>

                <Link
                  to="/matches"
                  className="dashboard-quiz-btn"
                >
                  Find Roommates →
                </Link>

              </div>
            )}

          {/* CONNECTED ROOMMATES */}

          {!connectionsLoading &&
            connectedRoommates.length > 0 && (
              <div className="connected-dashboard-grid">

                {connectedRoommates
                  .slice(0, 3)
                  .map((roommate) => (
                    <div
                      className="connected-dashboard-card"
                      key={roommate.id}
                    >

                      <div className="connected-dashboard-avatar">
                        👩🏻
                      </div>

                      <div className="connected-dashboard-info">

                        <div className="connected-status">
                          <span></span>
                          Connected
                        </div>

                        <h3>
                          {roommate.name ||
                            "Roommate"}
                        </h3>

                        <p>
                          {roommate.role ||
                            "Student"}
                        </p>

                        <small>
                          📍{" "}
                          {roommate.location ||
                            "Location not added"}
                        </small>

                      </div>

                      <Link
                        to={`/chat?userId=${roommate.id}`}
                        className="connected-chat-btn"
                      >
                        💬 Chat
                      </Link>

                    </div>
                  ))}

              </div>
            )}

        </section>

        {/* =================================================
            BEST MATCHES
        ================================================= */}

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

          {/* MATCH LOADING */}

          {matchesLoading && (
            <div className="dashboard-loading-small">

              <p>
                Finding your best roommates... 💕
              </p>

            </div>
          )}

          {/* NO MATCHES */}

          {!matchesLoading &&
            matches.length === 0 && (
              <div className="dashboard-empty">

                <div>
                  💕
                </div>

                <h3>
                  No matches yet
                </h3>

                <p>
                  Complete your lifestyle preferences
                  to find compatible roommates.
                </p>

                <Link
                  to="/quiz"
                  className="dashboard-quiz-btn"
                >
                  ✨ Complete Quiz
                </Link>

              </div>
            )}

          {/* MATCHES */}

          {!matchesLoading &&
            matches.length > 0 && (
              <div className="match-grid">

                {matches
                  .slice(0, 3)
                  .map((match, index) => (
                    <div
                      className="match-card"
                      key={match.id}
                    >

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
                          👩🏻
                        </div>

                        <div className="match-percentage">

                          <strong>
                            {Number(
                              match.compatibility
                            ) || 0}
                            %
                          </strong>

                          <span>
                            Compatible
                          </span>

                        </div>

                      </div>

                      <h3>
                        {match.name ||
                          "Roommate"}
                      </h3>

                      <p className="match-location">
                        📍{" "}
                        {match.location ||
                          "Location not added"}
                        {" • "}
                        {match.role ||
                          "Student"}
                      </p>

                      <p className="match-bio">
                        {match.bio ||
                          "Looking for a compatible roommate."}
                      </p>

                      <div className="match-tags">

                        {match.preferences?.sleep && (
                          <span>
                            🌙{" "}
                            {match.preferences.sleep}
                          </span>
                        )}

                        {match.preferences?.cleanliness && (
                          <span>
                            🧹{" "}
                            {match.preferences.cleanliness}
                          </span>
                        )}

                        {match.preferences?.social && (
                          <span>
                            🎉{" "}
                            {match.preferences.social}
                          </span>
                        )}

                      </div>

                      <div className="match-score-info">

                        <span>
                          {match.matchedCategories || 0}
                          {" "}of{" "}
                          {match.totalCategories || 6}
                          {" "}preferences matched
                        </span>

                      </div>

                      <Link
                        to={`/matches/${match.id}`}
                        className="match-profile-btn"
                      >
                        View Compatibility →
                      </Link>

                    </div>
                  ))}

              </div>
            )}

        </section>

        {/* =================================================
            YOUR LIFESTYLE
        ================================================= */}

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
              to="/quiz"
              className="edit-preferences"
            >
              ✏️ Edit Preferences
            </Link>

          </div>

          <div className="lifestyle-grid">

            <div>

              <span>
                🌙 Sleep Schedule
              </span>

              <strong>
                {preferences?.sleep ||
                  "Not added"}
              </strong>

            </div>

            <div>

              <span>
                🧹 Cleanliness
              </span>

              <strong>
                {preferences?.cleanliness ||
                  "Not added"}
              </strong>

            </div>

            <div>

              <span>
                🎉 Social Life
              </span>

              <strong>
                {preferences?.social ||
                  "Not added"}
              </strong>

            </div>

            <div>

              <span>
                🍳 Food
              </span>

              <strong>
                {preferences?.food ||
                  "Not added"}
              </strong>

            </div>

            <div>

              <span>
                📚 Study Environment
              </span>

              <strong>
                {preferences?.study ||
                  "Not added"}
              </strong>

            </div>

            <div>

              <span>
                🏠 Guests
              </span>

              <strong>
                {preferences?.guests ||
                  "Not added"}
              </strong>

            </div>

          </div>

        </section>

        {/* =================================================
            YOUR PROFILE
        ================================================= */}

        <section className="lifestyle-section">

          <div className="section-title-row">

            <div>

              <span>
                YOUR PROFILE
              </span>

              <h2>
                My Information
              </h2>

            </div>

            <Link
              to="/profile"
              className="edit-preferences"
            >
              ✏️ Edit Profile
            </Link>

          </div>

          <div className="lifestyle-grid">

            <div>

              <span>
                👤 Name
              </span>

              <strong>
                {user.name}
              </strong>

            </div>

            <div>

              <span>
                📧 Email
              </span>

              <strong>
                {user.email}
              </strong>

            </div>

            <div>

              <span>
                🎓 Role
              </span>

              <strong>
                {user.role || "Student"}
              </strong>

            </div>

            <div>

              <span>
                📍 Location
              </span>

              <strong>
                {user.location ||
                  "Not added"}
              </strong>

            </div>

            <div>

              <span>
                📝 Bio
              </span>

              <strong>
                {user.bio ||
                  "No bio added yet"}
              </strong>

            </div>

            <div>

              <span>
                ✨ Profile Status
              </span>

              <strong>
                Complete
              </strong>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;