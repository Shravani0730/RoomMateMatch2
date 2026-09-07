import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Matches() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    fetch(`https://backend-production-c6c1.up.railway.app/api/matches/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMatches(data.matches || []);
        } else {
          console.error("Matches error:", data.message);
          setMatches([]);
        }
      })
      .catch((error) => {
        console.error("Cannot load matches:", error);
        setMatches([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  // ================= FILTER MATCHES =================

  const filteredMatches = matches.filter((match) => {
    if (activeFilter === "90") {
      return match.compatibility >= 90;
    }

    if (activeFilter === "city") {
      return match.location === "Pune";
    }

    if (activeFilter === "students") {
      return match.role === "Student";
    }

    return true;
  });

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Finding your best roommates... 💕</h2>
        <p>Please wait while we compare your lifestyle preferences.</p>
      </div>
    );
  }

  return (
    <div className="matches-page">

      {/* ================= HEADER ================= */}

      <section className="matches-header">

        <div className="matches-header-content">

          <span className="matches-eyebrow">
            ROOMMATE MATCHING
          </span>

          <h1>
            Roommates made for you <span>❤️</span>
          </h1>

          <p>
            We found people whose lifestyle preferences match yours.
          </p>

        </div>

      </section>


      {/* ================= MATCH CONTAINER ================= */}

      <section className="matches-container">

        {/* ================= TOP ================= */}

        <div className="matches-top">

          <div className="matches-count">

            <strong>
              {matches.length}
            </strong>

            <span>
              Potential Matches
            </span>

          </div>


          {/* ================= FILTERS ================= */}

          <div className="match-filters">

            <button
              className={`filter-btn ${
                activeFilter === "all" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All Matches
            </button>


            <button
              className={`filter-btn ${
                activeFilter === "90" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("90")}
            >
              90%+ Match
            </button>


            <button
              className={`filter-btn ${
                activeFilter === "city" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("city")}
            >
              Same City
            </button>


            <button
              className={`filter-btn ${
                activeFilter === "students" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("students")}
            >
              Students
            </button>

          </div>

        </div>


        {/* ================= NO MATCHES ================= */}

        {filteredMatches.length === 0 && (

          <div className="dashboard-empty">

            <div>
              💕
            </div>

            <h3>
              No matches found
            </h3>

            <p>
              Try another filter or update your lifestyle preferences.
            </p>

            <Link
              to="/quiz"
              className="dashboard-quiz-btn"
            >
              ✨ Update Lifestyle
            </Link>

          </div>

        )}


        {/* ================= MATCH CARDS ================= */}

        {filteredMatches.length > 0 && (

          <div className="matches-grid">

            {filteredMatches.map((match) => (

              <div
                className="roommate-card"
                key={match.id}
              >

                {/* ================= CARD TOP ================= */}

                <div className="roommate-card-top">

                  <div className="roommate-avatar">
                    👩🏻
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


                {/* ================= USER INFO ================= */}

                <div className="roommate-info">

                  <h2>
                    {match.name}
                  </h2>

                  <p className="roommate-location">
                    📍 {match.location || "Location not added"} •{" "}
                    {match.role || "Student"}
                  </p>

                  <p className="roommate-bio">
                    {match.bio ||
                      "Looking for a compatible roommate"}
                  </p>

                </div>


                {/* ================= LIFESTYLE TAGS ================= */}

                <div className="lifestyle-tags">

                  {match.preferences?.sleep && (
                    <span>
                      🌙 {match.preferences.sleep}
                    </span>
                  )}

                  {match.preferences?.cleanliness && (
                    <span>
                      🧹 {match.preferences.cleanliness}
                    </span>
                  )}

                  {match.preferences?.social && (
                    <span>
                      🎉 {match.preferences.social}
                    </span>
                  )}

                  {match.preferences?.food && (
                    <span>
                      🍳 {match.preferences.food}
                    </span>
                  )}

                </div>


                {/* ================= MATCH SCORE ================= */}

                <div className="match-score-info">

                  <span>
                    {match.matchedCategories} of{" "}
                    {match.totalCategories} preferences matched
                  </span>

                </div>


                {/* ================= BUTTON ================= */}

                <Link
                  to={`/matches/${match.id}`}
                  className="compatibility-btn"
                >
                  View Compatibility →
                </Link>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default Matches;