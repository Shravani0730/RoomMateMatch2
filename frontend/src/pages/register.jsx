import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,

            // Default values for now
            role: "Student",
            location: "Pune",
            bio: "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Registration failed!");
        return;
      }

      alert("Account created successfully! ❤️");

      // Save user ID for later profile/quiz usage
      localStorage.setItem("userId", data.userId);

      // Save basic user information
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.userId,
          name: formData.name,
          email: formData.email,
          role: "Student",
          location: "Pune",
        })
      );

      // Go to quiz
      navigate("/quiz");

    } catch (error) {
      console.error("Registration error:", error);

      alert(
        "Cannot connect to server. Please make sure backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ================= LEFT SIDE ================= */}

      <div className="auth-left">

        <Link to="/" className="auth-logo">
          🏠 <span>RoomMate</span> Match
        </Link>

        <div className="auth-left-content">

          <div className="auth-badge">
            💕 Start your roommate journey
          </div>

          <h1>
            Find someone who
            <span> fits your life.</span>
          </h1>

          <p>
            Create your profile and tell us a little about yourself.
            We'll use your lifestyle preferences to help you discover
            better roommate matches.
          </p>

          <div className="auth-benefits">

            <div>
              <span className="benefit-icon">🧠</span>

              <div>
                <strong>Smart Matching</strong>
                <p>Matches based on your lifestyle.</p>
              </div>
            </div>

            <div>
              <span className="benefit-icon">❤️</span>

              <div>
                <strong>Compatibility Score</strong>
                <p>Understand how well you match.</p>
              </div>
            </div>

            <div>
              <span className="benefit-icon">🛡️</span>

              <div>
                <strong>Safe Connections</strong>
                <p>Connect through mutual matches.</p>
              </div>
            </div>

          </div>

        </div>

      </div>


      {/* ================= RIGHT SIDE ================= */}

      <div className="auth-right">

        <div className="auth-card">

          <div className="mobile-logo">
            🏠 <span>RoomMate</span> Match
          </div>


          <div className="form-heading">

            <span>CREATE ACCOUNT</span>

            <h2>
              Let's get started ✨
            </h2>

            <p>
              Create your account to start finding compatible roommates.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="form-group">

              <label>
                Full Name
              </label>

              <div className="input-wrapper">

                <span>👤</span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <span>✉️</span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="form-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span>🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

              <small>
                Use at least 6 characters.
              </small>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label>
                Confirm Password
              </label>

              <div className="input-wrapper">

                <span>🔐</span>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* TERMS */}

            <label className="terms">

              <input
                type="checkbox"
                required
              />

              <span>
                I agree to the
                <a href="#terms">
                  {" "}Terms & Conditions
                </a>
                {" "}and
                <a href="#privacy">
                  {" "}Privacy Policy
                </a>
                .
              </span>

            </label>


            {/* SUBMIT */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account →"}
            </button>

          </form>


          <div className="auth-divider">
            <span>
              Already have an account?
            </span>
          </div>


          <Link
            to="/login"
            className="login-link"
          >
            Login to your account
          </Link>


          <div className="secure-note">
            🔒 Your information is kept private and secure.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;