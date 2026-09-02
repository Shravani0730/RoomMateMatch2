import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { matches } from "../data/mockdata";

function MatchDetails() {
  const { id } = useParams();

  const [connected, setConnected] = useState(false);

  const match =
    matches.find((item) => item.id === Number(id)) || matches[0];

  return (
    <div className="match-details-page">

      {/* BACK BUTTON */}
      <div className="details-container">

        <Link to="/matches" className="back-matches">
          ← Back to Matches
        </Link>


        {/* PROFILE CARD */}
        <section className="details-profile-card">

          <div className="details-profile-left">

            <div className="details-avatar">
              {match.avatar}
            </div>

            <div className="details-user-info">

              <span className="potential-match">
                POTENTIAL MATCH
              </span>

              <h1>
                {match.name}, {match.age}
              </h1>

              <p>
                📍 {match.location} • {match.role}
              </p>

              <p className="details-bio">
                {match.bio}
              </p>

            </div>

          </div>


          {/* SCORE */}
          <div className="details-score">

            <div className="score-circle">

              <strong>
                {match.compatibility}%
              </strong>

            </div>

            <span>
              Compatibility
            </span>

          </div>

        </section>


        {/* ACTION BUTTONS */}
        <div className="details-actions">

          <Link
            to="/chat"
            className="send-message-btn"
          >
            💬 Send Message
          </Link>


          <button
            className={`connect-btn ${
              connected ? "connected" : ""
            }`}
            onClick={() => setConnected(!connected)}
          >
            {connected
              ? "💚 Connected"
              : "❤️ Connect"}
          </button>

        </div>


        {/* COMPATIBILITY ANALYSIS */}
        <section className="analysis-section">

          <div className="analysis-heading">

            <span>
              COMPATIBILITY ANALYSIS
            </span>

            <h2>
              Why you match
            </h2>

            <p>
              Here's how your lifestyle preferences compare.
            </p>

          </div>


          {/* COMPATIBILITY CARDS */}
          <div className="compatibility-grid">


            {/* SLEEP */}
            <div className="compatibility-card">

              <div className="compatibility-card-header">

                <span>🌙</span>

                <div>
                  <h3>Sleep Schedule</h3>
                  <p>Daily routine</p>
                </div>

              </div>


              <div className="comparison-row">

                <div>
                  <small>Your Preference</small>
                  <strong>Night Owl</strong>
                </div>

                <div className="match-arrow">
                  ↔
                </div>

                <div>
                  <small>
                    {match.name}'s Preference
                  </small>

                  <strong>
                    {match.sleep}
                  </strong>
                </div>

              </div>


              <div className="detail-progress">
                <div style={{ width: "98%" }}></div>
              </div>

              <span className="match-label">
                Excellent Match
              </span>

            </div>


            {/* CLEANLINESS */}
            <div className="compatibility-card">

              <div className="compatibility-card-header">

                <span>🧹</span>

                <div>
                  <h3>Cleanliness</h3>
                  <p>Living space habits</p>
                </div>

              </div>


              <div className="comparison-row">

                <div>
                  <small>Your Preference</small>
                  <strong>Very Clean</strong>
                </div>

                <div className="match-arrow">
                  ↔
                </div>

                <div>
                  <small>
                    {match.name}'s Preference
                  </small>

                  <strong>
                    {match.cleanliness}
                  </strong>
                </div>

              </div>


              <div className="detail-progress">
                <div style={{ width: "95%" }}></div>
              </div>

              <span className="match-label">
                Excellent Match
              </span>

            </div>


            {/* SOCIAL */}
            <div className="compatibility-card">

              <div className="compatibility-card-header">

                <span>🎉</span>

                <div>
                  <h3>Social Life</h3>
                  <p>Social preferences</p>
                </div>

              </div>


              <div className="comparison-row">

                <div>
                  <small>Your Preference</small>
                  <strong>Balanced</strong>
                </div>

                <div className="match-arrow">
                  ↔
                </div>

                <div>
                  <small>
                    {match.name}'s Preference
                  </small>

                  <strong>
                    {match.social}
                  </strong>
                </div>

              </div>


              <div className="detail-progress">
                <div style={{ width: "92%" }}></div>
              </div>

              <span className="match-label">
                Great Match
              </span>

            </div>


            {/* FOOD */}
            <div className="compatibility-card">

              <div className="compatibility-card-header">

                <span>🍳</span>

                <div>
                  <h3>Food Preferences</h3>
                  <p>Cooking & eating</p>
                </div>

              </div>


              <div className="comparison-row">

                <div>
                  <small>Your Preference</small>
                  <strong>Cooking</strong>
                </div>

                <div className="match-arrow">
                  ↔
                </div>

                <div>
                  <small>
                    {match.name}'s Preference
                  </small>

                  <strong>
                    {match.food}
                  </strong>
                </div>

              </div>


              <div className="detail-progress">
                <div style={{ width: "88%" }}></div>
              </div>

              <span className="match-label">
                Good Match
              </span>

            </div>

          </div>

        </section>


        {/* STRONG COMPATIBILITY & DISCUSSION */}
        <section className="analysis-bottom">


          {/* STRONG COMPATIBILITY */}
          <div className="strength-card">

            <div className="analysis-card-title">

              <div className="analysis-icon green">
                💚
              </div>

              <div>
                <h3>Strong Compatibility</h3>

                <p>
                  Things you already have in common
                </p>
              </div>

            </div>


            <div className="strength-list">

              {match.strengths.map((item, index) => (

                <div
                  className="strength-item"
                  key={index}
                >

                  <span>✓</span>

                  <p>
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* THINGS TO DISCUSS */}
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
                  Topics worth talking about
                </p>

              </div>

            </div>


            <div className="discussion-list">

              {match.conflicts.map((item, index) => (

                <div
                  className="discussion-item"
                  key={index}
                >

                  <span>•</span>

                  <p>
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* FINAL CTA */}
        <section className="details-cta">

          <div>

            <span>
              LIKE WHAT YOU SEE?
            </span>

            <h2>
              Start a conversation with {match.name}.
            </h2>

            <p>
              Get to know each other before deciding
              if you're the right roommate match.
            </p>

          </div>


          <Link
            to="/chat"
            className="send-message-btn"
          >
            💬 Send Message
          </Link>

        </section>

      </div>

    </div>
  );
}

export default MatchDetails;