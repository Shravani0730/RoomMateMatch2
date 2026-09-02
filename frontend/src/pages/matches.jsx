import { Link } from "react-router-dom";
import { matches } from "../data/mockdata";

function Matches() {
  return (
    <div className="matches-page">

      {/* HEADER */}
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


      {/* MATCH SUMMARY */}
      <section className="matches-container">

        <div className="matches-top">

          <div className="matches-count">
            <strong>{matches.length > 0 ? 24 : 0}</strong>
            <span>Potential Matches</span>
          </div>


          {/* FILTERS */}
          <div className="match-filters">

            <button className="filter-btn active">
              All Matches
            </button>

            <button className="filter-btn">
              90%+ Match
            </button>

            <button className="filter-btn">
              Same City
            </button>

            <button className="filter-btn">
              Students
            </button>

          </div>

        </div>


        {/* MATCH CARDS */}
        <div className="matches-grid">

          {matches.map((match) => (

            <div
              className="roommate-card"
              key={match.id}
            >

              {/* CARD TOP */}
              <div className="roommate-card-top">

                <div className="roommate-avatar">
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
              <div className="roommate-info">

                <h2>
                  {match.name}, {match.age}
                </h2>

                <p className="roommate-location">
                  📍 {match.location} • {match.role}
                </p>

                <p className="roommate-bio">
                  {match.bio}
                </p>

              </div>


              {/* LIFESTYLE TAGS */}
              <div className="lifestyle-tags">

                <span>
                  🌙 {match.sleep}
                </span>

                <span>
                  🧹 {match.cleanliness}
                </span>

                <span>
                  🎉 {match.social}
                </span>

                <span>
                  🍳 {match.food}
                </span>

              </div>


              {/* BUTTON */}
              <Link
                to={`/matches/${match.id}`}
                className="compatibility-btn"
              >
                View Compatibility →
              </Link>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default Matches;