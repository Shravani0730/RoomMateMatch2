import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      // Save logged-in user information
      localStorage.setItem("userId", data.user.id);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Login successful! ❤️");

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Cannot connect to server. Please make sure the backend is running."
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
            ❤️ Welcome back
          </div>

          <h1>
            Your perfect
            <span> roommate match</span>
            is waiting.
          </h1>

          <p>
            Log in to continue discovering people who match
            your lifestyle, habits and living preferences.
          </p>

          <div className="auth-benefits">

            <div>
              <span className="benefit-icon">
                💕
              </span>

              <div>
                <strong>
                  Compatible Matches
                </strong>

                <p>
                  Discover people who fit your lifestyle.
                </p>
              </div>
            </div>

            <div>
              <span className="benefit-icon">
                📊
              </span>

              <div>
                <strong>
                  Smart Compatibility
                </strong>

                <p>
                  See your compatibility score.
                </p>
              </div>
            </div>

            <div>
              <span className="benefit-icon">
                🏠
              </span>

              <div>
                <strong>
                  Better Living
                </strong>

                <p>
                  Make roommate living easier.
                </p>
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

            <span>
              WELCOME BACK
            </span>

            <h2>
              Login to your account 👋
            </h2>

            <p>
              Enter your details to continue.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* ================= EMAIL ================= */}

            <div className="form-group">

              <label>
                Email Address
              </label>

              <div className="input-wrapper">

                <span>
                  ✉️
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* ================= PASSWORD ================= */}

            <div className="form-group">

              <div className="password-label">

                <label>
                  Password
                </label>

                <a href="#forgot-password">
                  Forgot password?
                </a>

              </div>

              <div className="input-wrapper">

                <span>
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* ================= REMEMBER ME ================= */}

            <label className="remember-me">

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>


            {/* ================= LOGIN BUTTON ================= */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login →"}
            </button>

          </form>


          {/* ================= CREATE ACCOUNT ================= */}

          <div className="auth-divider">

            <span>
              Don't have an account?
            </span>

          </div>

          <Link
            to="/register"
            className="login-link"
          >
            Create a new account
          </Link>


          {/* ================= SECURITY NOTE ================= */}

          <div className="secure-note">
            🔒 Your information is kept private and secure.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;