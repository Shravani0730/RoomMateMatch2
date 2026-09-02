import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="home-page">

      <Navbar />

      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-text">

            <div className="hero-badge">
              ✨ Find your perfect living partner
            </div>

            <h1>
              Find a roommate who
              <span> matches your lifestyle.</span>
            </h1>

            <p>
              RoomMate Match helps you discover compatible roommates
              based on your habits, personality, budget and lifestyle —
              not just location.
            </p>

            <div className="hero-buttons">

              <Link
                to="/register"
                className="primary-btn"
              >
                Find My Roommate →
              </Link>

              <a
                href="#how-it-works"
                className="secondary-btn"
              >
                How It Works
              </a>

            </div>

            <div className="hero-stats">

              <div>
                <strong>10K+</strong>
                <span>Users</span>
              </div>

              <div>
                <strong>95%</strong>
                <span>Happy Matches</span>
              </div>

              <div>
                <strong>4.9★</strong>
                <span>User Rating</span>
              </div>

            </div>

          </div>


          {/* =========================
              COMPATIBILITY CARD
          ========================= */}

          <div className="hero-visual">

            <div className="floating-card card-one">

              ❤️

              <div>
                <strong>Perfect Match!</strong>
                <span>94% Compatible</span>
              </div>

            </div>


            <div className="profile-card">

              <div className="profile-top">

                <div className="profile-avatar">
                  👩🏻
                </div>

                <div>
                  <h3>Priya Sharma</h3>
                  <p>Student • Pune</p>
                </div>

                <div className="online-dot"></div>

              </div>


              <div className="compatibility">

                <div className="compatibility-circle">

                  <strong>94%</strong>

                  <span>Match</span>

                </div>


                <div className="match-details">

                  <div>
                    <span>🛏️ Sleep</span>
                    <strong>98%</strong>
                  </div>

                  <div>
                    <span>🧹 Cleanliness</span>
                    <strong>95%</strong>
                  </div>

                  <div>
                    <span>📚 Study</span>
                    <strong>92%</strong>
                  </div>

                  <div>
                    <span>🔊 Noise</span>
                    <strong>90%</strong>
                  </div>

                </div>

              </div>


              {/* CONNECTED TO MATCH DETAILS */}
              <Link
                to="/matches/1"
                className="view-profile-btn"
              >
                View Compatibility →
              </Link>

            </div>


            <div className="floating-card card-two">

              🧠

              <div>
                <strong>Smart Matching</strong>
                <span>Based on your lifestyle</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FEATURES
      ========================= */}

      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span>WHY ROOMMATE MATCH?</span>

          <h2>
            More than just a
            <span> roommate finder.</span>
          </h2>

          <p>
            We look beyond rent and location to find people
            who actually fit your everyday lifestyle.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              🧠
            </div>

            <h3>
              Lifestyle Matching
            </h3>

            <p>
              Match based on sleep schedules, cleanliness,
              study habits, food preferences and more.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ❤️
            </div>

            <h3>
              Compatibility Score
            </h3>

            <p>
              Get a personalized compatibility score that
              explains why you and your potential roommate match.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ⚠️
            </div>

            <h3>
              Conflict Prediction
            </h3>

            <p>
              Identify potential lifestyle conflicts before
              you decide to live together.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🛡️
            </div>

            <h3>
              Safe Community
            </h3>

            <p>
              Connect through mutual matches and maintain
              control over your privacy and interactions.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading">

          <span>HOW IT WORKS</span>

          <h2>
            Find your match in
            <span> 3 simple steps.</span>
          </h2>

        </div>


        <div className="steps-container">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              👤
            </div>

            <h3>
              Create Your Profile
            </h3>

            <p>
              Tell us about yourself, your preferences
              and the kind of roommate you're looking for.
            </p>

            <Link
              to="/register"
              className="step-link"
            >
              Create Profile →
            </Link>

          </div>


          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              🧠
            </div>

            <h3>
              Take the Lifestyle Quiz
            </h3>

            <p>
              Answer a few simple questions about your
              daily habits and lifestyle.
            </p>

            <Link
              to="/quiz"
              className="step-link"
            >
              Take Quiz →
            </Link>

          </div>


          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              💕
            </div>

            <h3>
              Meet Your Matches
            </h3>

            <p>
              Discover compatible roommates and connect
              with people who match your lifestyle.
            </p>

            <Link
              to="/matches"
              className="step-link"
            >
              View Matches →
            </Link>

          </div>

        </div>

      </section>


      {/* =========================
          TRUST SECTION
      ========================= */}

      <section className="trust-section">

        <div className="trust-content">

          <div className="trust-text">

            <span>
              LIVE BETTER TOGETHER
            </span>

            <h2>
              Your perfect roommate
              <span> is out there.</span>
            </h2>

            <p>
              Sharing a home is easier when your lifestyles
              align. RoomMate Match helps you find someone
              who fits naturally into your daily routine.
            </p>


            <div className="trust-points">

              <div>
                ✓ Lifestyle-based matching
              </div>

              <div>
                ✓ Explainable compatibility scores
              </div>

              <div>
                ✓ Potential conflict detection
              </div>

              <div>
                ✓ Privacy-focused connections
              </div>

            </div>


            <Link
              to="/register"
              className="primary-btn"
            >
              Start Matching →
            </Link>

          </div>


          <div className="trust-visual">

            <div className="big-heart">
              ❤️
            </div>

            <div className="mini-card">

              <strong>
                92%
              </strong>

              <span>
                Compatibility
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CTA
      ========================= */}

      <section className="cta-section">

        <div>

          <span>
            READY TO FIND YOUR MATCH?
          </span>

          <h2>
            Your next great roommate
            <br />
            could be one quiz away.
          </h2>

          <Link
            to="/register"
            className="cta-button"
          >
            Get Started — It's Free ✨
          </Link>

        </div>

      </section>


      <Footer />

    </div>
  );
}

export default Home;