import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [match, setMatch] = useState(null);
  const [myPreferences, setMyPreferences] = useState(null);

  const [connectionStatus, setConnectionStatus] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [connectionLoading, setConnectionLoading] =
    useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // CURRENT USER
  // =====================================================

  const userId = localStorage.getItem("userId");

  // =====================================================
  // PREFERENCE CATEGORIES
  // =====================================================

  const preferenceCategories = [
    {
      key: "sleep",
      title: "Sleep Schedule",
      subtitle: "Daily routine",
      icon: "🌙",
    },
    {
      key: "cleanliness",
      title: "Cleanliness",
      subtitle: "Living space habits",
      icon: "🧹",
    },
    {
      key: "social",
      title: "Social Life",
      subtitle: "Social preferences",
      icon: "🎉",
    },
    {
      key: "food",
      title: "Food Preferences",
      subtitle: "Cooking & eating",
      icon: "🍳",
    },
    {
      key: "study",
      title: "Study Environment",
      subtitle: "Study & noise preferences",
      icon: "📚",
    },
    {
      key: "guests",
      title: "Guests",
      subtitle: "Visitors & social space",
      icon: "🏠",
    },
  ];

  // =====================================================
  // LOAD MATCH DETAILS
  // =====================================================

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const loadMatchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // ---------------------------------------------
        // GET MATCHES
        // ---------------------------------------------

        const matchesResponse = await fetch(
          `https://backend-production-c6c1.up.railway.app/api/matches/${userId}`
        );

        if (!matchesResponse.ok) {
          throw new Error("Failed to load matches");
        }

        const matchesData =
          await matchesResponse.json();

        if (!matchesData.success) {
          throw new Error(
            matchesData.message ||
              "Unable to load matches"
          );
        }

        const selectedMatch =
          matchesData.matches?.find(
            (item) =>
              Number(item.id) === Number(id)
          );

        if (!selectedMatch) {
          setError("Roommate match not found.");
          return;
        }

        setMatch(selectedMatch);

        // ---------------------------------------------
        // GET MY PREFERENCES
        // ---------------------------------------------

        try {
          const preferencesResponse =
            await fetch(
              `https://backend-production-c6c1.up.railway.app/api/preferences/${userId}`
            );

          if (preferencesResponse.ok) {
            const preferencesData =
              await preferencesResponse.json();

            if (
              preferencesData.success &&
              preferencesData.preferences
            ) {
              setMyPreferences(
                preferencesData.preferences
              );
            }
          }
        } catch (preferenceError) {
          console.log(
            "Preferences could not be loaded:",
            preferenceError
          );
        }

        // ---------------------------------------------
        // GET CONNECTION STATUS
        // ---------------------------------------------

        try {
          const connectionResponse =
            await fetch(
              `https://backend-production-c6c1.up.railway.app/api/connections/${userId}`
            );

          if (connectionResponse.ok) {
            const connectionData =
              await connectionResponse.json();

            if (
              connectionData.success &&
              connectionData.connections
            ) {
              const existingConnection =
                connectionData.connections.find(
                  (connection) => {
                    const sender =
                      Number(connection.sender_id);

                    const receiver =
                      Number(connection.receiver_id);

                    const current =
                      Number(userId);

                    const other =
                      Number(id);

                    return (
                      (sender === current &&
                        receiver === other) ||
                      (sender === other &&
                        receiver === current)
                    );
                  }
                );

              if (existingConnection) {
                setConnectionStatus(
                  existingConnection.status
                );
              }
            }
          }
        } catch (connectionError) {
          console.log(
            "Connection status could not be loaded:",
            connectionError
          );
        }
      } catch (err) {
        console.error(
          "Match details error:",
          err
        );

        setError(
          "Unable to load roommate details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMatchDetails();
  }, [id, userId, navigate]);

  // =====================================================
  // SEND CONNECTION REQUEST
  // =====================================================

  const handleConnect = async () => {
    if (!userId || !match) {
      return;
    }

    try {
      setConnectionLoading(true);

      const response = await fetch(
        "https://backend-production-c6c1.up.railway.app/api/connections",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            sender_id: Number(userId),
            receiver_id: Number(match.id),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Connection response:",
        data
      );

      if (!response.ok) {
        if (data.connection) {
          setConnectionStatus(
            data.connection.status
          );
        }

        alert(
          data.message ||
            "Unable to send connection request."
        );

        return;
      }

      setConnectionStatus("pending");

      alert(
        "Connection request sent successfully ❤️"
      );
    } catch (err) {
      console.error(
        "Connection request error:",
        err
      );

      alert(
        "Unable to connect to the backend."
      );
    } finally {
      setConnectionLoading(false);
    }
  };

  // =====================================================
  // OPEN CHAT
  // =====================================================

  const openChat = () => {
    if (!match) {
      return;
    }

    // VERY IMPORTANT:
    // Chat.jsx reads chatUserId from localStorage.
    localStorage.setItem(
      "chatUserId",
      String(match.id)
    );

    console.log(
      "Opening chat with user:",
      match.id
    );

    // Open Chat page
    navigate("/chat");
  };

  // =====================================================
  // CATEGORY SCORE
  // =====================================================

  const getCategoryScore = (
    myValue,
    matchValue
  ) => {
    if (
      !myValue ||
      !matchValue ||
      myValue === "Not added" ||
      matchValue === "Not added"
    ) {
      return 0;
    }

    if (
      String(myValue).toLowerCase() ===
      String(matchValue).toLowerCase()
    ) {
      return 100;
    }

    return 55;
  };

  // =====================================================
  // CATEGORY LABEL
  // =====================================================

  const getCategoryLabel = (score) => {
    if (score >= 90) {
      return "Excellent Match";
    }

    if (score >= 70) {
      return "Great Match";
    }

    if (score >= 50) {
      return "Good Match";
    }

    if (score > 0) {
      return "Different Preferences";
    }

    return "Not Available";
  };

  // =====================================================
  // CONNECTION BUTTON TEXT
  // =====================================================

  const getConnectionButton = () => {
    if (connectionStatus === "accepted") {
      return "💚 Connected";
    }

    if (connectionStatus === "pending") {
      return "💚 Request Sent";
    }

    if (connectionStatus === "rejected") {
      return "❤️ Connect Again";
    }

    return "❤️ Connect";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>
          Finding compatibility details... 💕
        </h2>

        <p>
          Comparing your lifestyle preferences.
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !match) {
    return (
      <div className="dashboard-empty">
        <div>💔</div>

        <h2>Match not found</h2>

        <p>
          {error ||
            "We could not find this roommate."}
        </p>

        <Link
          to="/matches"
          className="dashboard-quiz-btn"
        >
          ← Back to Matches
        </Link>
      </div>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const matchPreferences =
    match.preferences || {};

  const compatibility =
    Number(match.compatibility) || 0;

  const matchedCategories =
    Number(match.matchedCategories) || 0;

  const totalCategories =
    Number(match.totalCategories) ||
    preferenceCategories.length;

  // =====================================================
  // STRONG MATCHES
  // =====================================================

  const strongMatches =
    preferenceCategories
      .filter((category) => {
        const myValue =
          myPreferences?.[category.key];

        const matchValue =
          matchPreferences?.[category.key];

        return (
          myValue &&
          matchValue &&
          String(myValue).toLowerCase() ===
            String(matchValue).toLowerCase()
        );
      })
      .map((category) => {
        const value =
          myPreferences?.[category.key];

        return `${category.title}: You both prefer "${value}".`;
      });

  // =====================================================
  // DISCUSSION TOPICS
  // =====================================================

  const discussionTopics =
    preferenceCategories
      .filter((category) => {
        const myValue =
          myPreferences?.[category.key];

        const matchValue =
          matchPreferences?.[category.key];

        return (
          myValue &&
          matchValue &&
          String(myValue).toLowerCase() !==
            String(matchValue).toLowerCase()
        );
      })
      .map((category) => {
        const myValue =
          myPreferences?.[category.key];

        const matchValue =
          matchPreferences?.[category.key];

        return `${category.title}: You prefer "${myValue}", while ${match.name} prefers "${matchValue}".`;
      });

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="match-details-page">

      <div className="details-container">

        {/* ================================================= */}
        {/* BACK */}
        {/* ================================================= */}

        <Link
          to="/matches"
          className="back-matches"
        >
          ← Back to Matches
        </Link>

        {/* ================================================= */}
        {/* PROFILE CARD */}
        {/* ================================================= */}

        <section className="details-profile-card">

          <div className="details-profile-left">

            <div className="details-avatar">
              👩🏻
            </div>

            <div className="details-user-info">

              <span className="potential-match">
                POTENTIAL MATCH
              </span>

              <h1>
                {match.name}
              </h1>

              <p>
                📍{" "}
                {match.location ||
                  "Location not added"}
                {" • "}
                {match.role || "Student"}
              </p>

              <p className="details-bio">
                {match.bio ||
                  "Looking for a compatible roommate"}
              </p>

            </div>

          </div>

          {/* SCORE */}

          <div className="details-score">

            <div className="score-circle">

              <strong>
                {compatibility}%
              </strong>

            </div>

            <span>
              Compatibility
            </span>

          </div>

        </section>

        {/* ================================================= */}
        {/* ACTION BUTTONS */}
        {/* ================================================= */}

        <div className="details-actions">

          {/* CONNECTION */}

          <button
            className={`connect-btn ${
              connectionStatus ===
              "accepted"
                ? "connected"
                : ""
            }`}
            onClick={handleConnect}
            disabled={
              connectionLoading ||
              connectionStatus ===
                "pending" ||
              connectionStatus ===
                "accepted"
            }
          >
            {connectionLoading
              ? "Sending..."
              : getConnectionButton()}
          </button>

          {/* CHAT */}

          <button
            type="button"
            className="send-message-btn"
            onClick={openChat}
          >
            💬 Send Message
          </button>

        </div>

        {/* ================================================= */}
        {/* COMPATIBILITY ANALYSIS */}
        {/* ================================================= */}

        <section className="analysis-section">

          <div className="analysis-heading">

            <span>
              COMPATIBILITY ANALYSIS
            </span>

            <h2>
              Why you match
            </h2>

            <p>
              Here's how your lifestyle
              preferences compare.
            </p>

          </div>

          {/* ================================================= */}
          {/* SUMMARY */}
          {/* ================================================= */}

          <div className="compatibility-summary">

            <div className="summary-box">

              <strong>
                {compatibility}%
              </strong>

              <span>
                Overall Compatibility
              </span>

            </div>

            <div className="summary-box">

              <strong>
                {matchedCategories}
              </strong>

              <span>
                Preferences Matched
              </span>

            </div>

            <div className="summary-box">

              <strong>
                {totalCategories}
              </strong>

              <span>
                Total Categories
              </span>

            </div>

          </div>

          {/* ================================================= */}
          {/* PREFERENCE CARDS */}
          {/* ================================================= */}

          <div className="compatibility-grid">

            {preferenceCategories.map(
              (category) => {

                const myValue =
                  myPreferences?.[
                    category.key
                  ] || "Not added";

                const matchValue =
                  matchPreferences?.[
                    category.key
                  ] || "Not added";

                const score =
                  getCategoryScore(
                    myValue,
                    matchValue
                  );

                const label =
                  getCategoryLabel(score);

                return (
                  <div
                    className="compatibility-card"
                    key={category.key}
                  >

                    {/* HEADER */}

                    <div className="compatibility-card-header">

                      <span>
                        {category.icon}
                      </span>

                      <div>

                        <h3>
                          {category.title}
                        </h3>

                        <p>
                          {category.subtitle}
                        </p>

                      </div>

                    </div>

                    {/* COMPARISON */}

                    <div className="comparison-row">

                      <div>

                        <small>
                          Your Preference
                        </small>

                        <strong>
                          {myValue}
                        </strong>

                      </div>

                      <div className="match-arrow">
                        ↔
                      </div>

                      <div>

                        <small>
                          {match.name}'s
                          Preference
                        </small>

                        <strong>
                          {matchValue}
                        </strong>

                      </div>

                    </div>

                    {/* PROGRESS */}

                    <div className="detail-progress">

                      <div
                        style={{
                          width: `${score}%`,
                        }}
                      />

                    </div>

                    {/* LABEL */}

                    <span className="match-label">
                      {label}
                    </span>

                  </div>
                );
              }
            )}

          </div>

        </section>

        {/* ================================================= */}
        {/* STRONG MATCHES + DISCUSSION */}
        {/* ================================================= */}

        <section className="analysis-bottom">

          {/* ================================================= */}
          {/* STRONG COMPATIBILITY */}
          {/* ================================================= */}

          <div className="strength-card">

            <div className="analysis-card-title">

              <div className="analysis-icon green">
                💚
              </div>

              <div>

                <h3>
                  Strong Compatibility
                </h3>

                <p>
                  Things you already have
                  in common
                </p>

              </div>

            </div>

            <div className="strength-list">

              {strongMatches.length >
              0 ? (
                strongMatches.map(
                  (item, index) => (
                    <div
                      className="strength-item"
                      key={index}
                    >

                      <span>
                        ✓
                      </span>

                      <p>
                        {item}
                      </p>

                    </div>
                  )
                )
              ) : (
                <div className="strength-item">

                  <span>
                    💕
                  </span>

                  <p>
                    You have different
                    preferences, but that
                    doesn't mean you cannot
                    be good roommates.
                  </p>

                </div>
              )}

            </div>

          </div>

          {/* ================================================= */}
          {/* DISCUSSION */}
          {/* ================================================= */}

          <div className="discussion-card">

            <div className="analysis-card-title">

              <div className="analysis-icon yellow">
                💛
              </div>

              <div>

                <h3>
                  Things to Discuss
                </h3>

                <p>
                  Topics worth talking
                  about
                </p>

              </div>

            </div>

            <div className="discussion-list">

              {discussionTopics.length >
              0 ? (
                discussionTopics.map(
                  (item, index) => (
                    <div
                      className="discussion-item"
                      key={index}
                    >

                      <span>
                        •
                      </span>

                      <p>
                        {item}
                      </p>

                    </div>
                  )
                )
              ) : (
                <div className="discussion-item">

                  <span>
                    ✓
                  </span>

                  <p>
                    Great! Your preferences
                    are very similar.
                  </p>

                </div>
              )}

            </div>

          </div>

        </section>

        {/* ================================================= */}
        {/* FINAL CTA */}
        {/* ================================================= */}

        <section className="details-cta">

          <div>

            <span>
              LIKE WHAT YOU SEE?
            </span>

            <h2>
              Start a conversation with{" "}
              {match.name}.
            </h2>

            <p>
              Get to know each other before
              deciding if you're the right
              roommate match.
            </p>

          </div>

          <button
            type="button"
            className="send-message-btn"
            onClick={openChat}
          >
            💬 Send Message
          </button>

        </section>

      </div>

    </div>
  );
}

export default MatchDetails;