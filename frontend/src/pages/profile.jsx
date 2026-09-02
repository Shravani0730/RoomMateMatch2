import { Link } from "react-router-dom";
import { useState } from "react";

function Profile() {
  const savedProfile = JSON.parse(
    localStorage.getItem("roommateProfile") || "null"
  );

  const defaultProfile = {
    name: "Shravani",
    role: "Student",
    location: "Pune",
    bio: "I am a student looking for a friendly, respectful and compatible roommate. I prefer a clean environment and peaceful study time while still enjoying social activities.",
    sleep: "Night Owl",
    cleanliness: "Very Clean",
    social: "Balanced",
    food: "Cooking",
    study: "Very Quiet",
    guests: "Sometimes",
  };

  const [profile, setProfile] = useState(
    savedProfile || defaultProfile
  );

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState(profile);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Start editing
  const handleEdit = () => {
    setFormData(profile);
    setEditMode(true);
  };

  // Save changes
  const handleSave = () => {
    setProfile(formData);

    localStorage.setItem(
      "roommateProfile",
      JSON.stringify(formData)
    );

    setEditMode(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  return (
    <div className="inner-page">

      {/* ================= NAVBAR ================= */}

      <header className="inner-navbar">

        <Link to="/" className="dashboard-logo">
          🏠 <span>RoomMate</span> Match
        </Link>

        <Link to="/dashboard" className="nav-back">
          ← Dashboard
        </Link>

      </header>


      <main className="profile-page">

        {/* ================= PROFILE HERO ================= */}

        <section className="profile-hero">

          <div className="profile-avatar-large">
            👩🏻
          </div>

          <div className="profile-main-info">

            <span className="profile-label">
              MY PROFILE
            </span>

            {!editMode ? (
              <>
                <h1>{profile.name}</h1>

                <p>
                  🎓 {profile.role} • 📍 {profile.location}
                </p>

                <div className="profile-actions">

                  <button
                    type="button"
                    onClick={handleEdit}
                    className="edit-profile-btn"
                  >
                    ✏️ Edit Profile
                  </button>

                </div>
              </>
            ) : (
              <div className="profile-edit-form">

                {/* NAME */}

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />


                {/* ROLE */}

                <label>
                  Role
                </label>

                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Student"
                />


                {/* LOCATION */}

                <label>
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Pune"
                />


                {/* BUTTONS */}

                <div className="edit-buttons">

                  <button
                    type="button"
                    className="save-profile-btn"
                    onClick={handleSave}
                  >
                    💾 Save Changes
                  </button>

                  <button
                    type="button"
                    className="cancel-profile-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

          </div>

        </section>


        {/* ================= LIFESTYLE ================= */}

        <section className="profile-section">

          <div className="section-title-row">

            <div>
              <span>LIFESTYLE</span>
              <h2>My Preferences</h2>
            </div>

            {!editMode && (
              <button
                type="button"
                className="edit-preferences"
                onClick={handleEdit}
              >
                ✏️ Edit Preferences
              </button>
            )}

          </div>


          {!editMode ? (

            /* ---------- VIEW MODE ---------- */

            <div className="profile-preferences">

              <div>
                <span>🌙 Sleep Schedule</span>
                <strong>{profile.sleep}</strong>
              </div>

              <div>
                <span>🧹 Cleanliness</span>
                <strong>{profile.cleanliness}</strong>
              </div>

              <div>
                <span>🎉 Social Life</span>
                <strong>{profile.social}</strong>
              </div>

              <div>
                <span>🍳 Food</span>
                <strong>{profile.food}</strong>
              </div>

              <div>
                <span>📚 Study Environment</span>
                <strong>{profile.study}</strong>
              </div>

              <div>
                <span>🏠 Guests</span>
                <strong>{profile.guests}</strong>
              </div>

            </div>

          ) : (

            /* ---------- EDIT MODE ---------- */

            <div className="profile-preferences-edit">

              {/* SLEEP */}

              <div className="edit-preference-field">

                <label>
                  🌙 Sleep Schedule
                </label>

                <select
                  name="sleep"
                  value={formData.sleep}
                  onChange={handleChange}
                >
                  <option value="Early Bird">
                    Early Bird
                  </option>

                  <option value="Regular">
                    Regular
                  </option>

                  <option value="Night Owl">
                    Night Owl
                  </option>
                </select>

              </div>


              {/* CLEANLINESS */}

              <div className="edit-preference-field">

                <label>
                  🧹 Cleanliness
                </label>

                <select
                  name="cleanliness"
                  value={formData.cleanliness}
                  onChange={handleChange}
                >
                  <option value="Relaxed">
                    Relaxed
                  </option>

                  <option value="Moderately Clean">
                    Moderately Clean
                  </option>

                  <option value="Very Clean">
                    Very Clean
                  </option>
                </select>

              </div>


              {/* SOCIAL */}

              <div className="edit-preference-field">

                <label>
                  🎉 Social Life
                </label>

                <select
                  name="social"
                  value={formData.social}
                  onChange={handleChange}
                >
                  <option value="Quiet">
                    Quiet
                  </option>

                  <option value="Balanced">
                    Balanced
                  </option>

                  <option value="Very Social">
                    Very Social
                  </option>
                </select>

              </div>


              {/* FOOD */}

              <div className="edit-preference-field">

                <label>
                  🍳 Food Preferences
                </label>

                <select
                  name="food"
                  value={formData.food}
                  onChange={handleChange}
                >
                  <option value="Eating Out">
                    Eating Out
                  </option>

                  <option value="Both">
                    Both
                  </option>

                  <option value="Cooking">
                    Cooking
                  </option>
                </select>

              </div>


              {/* STUDY */}

              <div className="edit-preference-field">

                <label>
                  📚 Study Environment
                </label>

                <select
                  name="study"
                  value={formData.study}
                  onChange={handleChange}
                >
                  <option value="Social">
                    Social
                  </option>

                  <option value="Moderate">
                    Moderate
                  </option>

                  <option value="Very Quiet">
                    Very Quiet
                  </option>
                </select>

              </div>


              {/* GUESTS */}

              <div className="edit-preference-field">

                <label>
                  🏠 Guests
                </label>

                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                >
                  <option value="Rarely">
                    Rarely
                  </option>

                  <option value="Sometimes">
                    Sometimes
                  </option>

                  <option value="Often">
                    Often
                  </option>
                </select>

              </div>

            </div>

          )}

        </section>


        {/* ================= ABOUT ME ================= */}

        <section className="profile-section">

          <span className="profile-label">
            ABOUT ME
          </span>

          <h2>
            A little about me
          </h2>


          {!editMode ? (

            <p className="profile-bio">
              {profile.bio}
            </p>

          ) : (

            <div className="bio-edit-container">

              <label>
                About Me
              </label>

              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us something about yourself..."
                rows="6"
              />

            </div>

          )}

        </section>


        {/* ================= SAVE AREA ================= */}

        {editMode && (

          <section className="profile-save-section">

            <p>
              ✨ Make sure your profile information is correct
              before saving.
            </p>

            <div className="edit-buttons">

              <button
                type="button"
                className="save-profile-btn"
                onClick={handleSave}
              >
                💾 Save All Changes
              </button>

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default Profile;