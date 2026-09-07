import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ======================================================
  // DEFAULT PREFERENCES
  // ======================================================

  const defaultPreferences = {
    sleep: "Night Owl",
    cleanliness: "Very Clean",
    social: "Balanced",
    food: "Cooking",
    study: "Very Quiet",
    guests: "Sometimes",
  };

  // ======================================================
  // LOAD PROFILE + PREFERENCES FROM DATABASE
  // ======================================================

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);

        // --------------------------------------------------
        // LOAD USER
        // --------------------------------------------------

        const userResponse = await fetch(
          `https://backend-production-c6c1.up.railway.app/api/users/${userId}`
        );

        const userData = await userResponse.json();

        if (!userResponse.ok || !userData.success) {
          alert(userData.message || "Unable to load profile.");
          navigate("/login");
          return;
        }

        const user = userData.user;

        // --------------------------------------------------
        // LOAD PREFERENCES FROM MYSQL
        // --------------------------------------------------

        const preferenceResponse = await fetch(
          `https://backend-production-c6c1.up.railway.app/api/preferences/${userId}`
        );

        const preferenceData = await preferenceResponse.json();

        let savedPreferences = {};

        if (
          preferenceResponse.ok &&
          preferenceData.success &&
          preferenceData.preferences
        ) {
          savedPreferences = preferenceData.preferences;
        }

        // --------------------------------------------------
        // COMBINE USER + PREFERENCES
        // --------------------------------------------------

        const completeProfile = {
          name: user.name || "",
          role: user.role || "Student",
          location: user.location || "",
          bio: user.bio || "",

          sleep:
            savedPreferences.sleep || defaultPreferences.sleep,

          cleanliness:
            savedPreferences.cleanliness ||
            defaultPreferences.cleanliness,

          social:
            savedPreferences.social ||
            defaultPreferences.social,

          food:
            savedPreferences.food ||
            defaultPreferences.food,

          study:
            savedPreferences.study ||
            defaultPreferences.study,

          guests:
            savedPreferences.guests ||
            defaultPreferences.guests,
        };

        setProfile(completeProfile);
        setFormData(completeProfile);
      } catch (error) {
        console.error("❌ Profile loading error:", error);

        alert(
          "Cannot connect to server. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ======================================================
  // START EDITING
  // ======================================================

  const handleEdit = () => {
    setFormData({ ...profile });
    setEditMode(true);
  };

  // ======================================================
  // SAVE PROFILE + PREFERENCES
  // ======================================================

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User session not found. Please login again.");
      navigate("/login");
      return;
    }

    if (!formData.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      // ==================================================
      // 1. UPDATE USER PROFILE
      // ==================================================

      const userResponse = await fetch(
        `https://backend-production-c6c1.up.railway.app/api/users/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name,
            role: formData.role,
            location: formData.location,
            bio: formData.bio,
          }),
        }
      );

      const userData = await userResponse.json();

      if (!userResponse.ok || !userData.success) {
        alert(
          userData.message || "Unable to update profile."
        );
        return;
      }

      // ==================================================
      // 2. UPDATE LIFESTYLE PREFERENCES IN MYSQL
      // ==================================================

      const preferenceResponse = await fetch(
        `https://backend-production-c6c1.up.railway.app/api/preferences/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            sleep: formData.sleep,
            cleanliness: formData.cleanliness,
            social: formData.social,
            food: formData.food,
            study: formData.study,
            guests: formData.guests,
          }),
        }
      );

      const preferenceData = await preferenceResponse.json();

      if (
        !preferenceResponse.ok ||
        !preferenceData.success
      ) {
        alert(
          preferenceData.message ||
            "Profile updated, but preferences could not be saved."
        );
        return;
      }

      // ==================================================
      // 3. CREATE UPDATED PROFILE
      // ==================================================

      const updatedUser = userData.user;

      const updatedPreferences =
        preferenceData.preferences;

      const updatedProfile = {
        name: updatedUser.name || "",
        role: updatedUser.role || "Student",
        location: updatedUser.location || "",
        bio: updatedUser.bio || "",

        sleep:
          updatedPreferences?.sleep ||
          formData.sleep,

        cleanliness:
          updatedPreferences?.cleanliness ||
          formData.cleanliness,

        social:
          updatedPreferences?.social ||
          formData.social,

        food:
          updatedPreferences?.food ||
          formData.food,

        study:
          updatedPreferences?.study ||
          formData.study,

        guests:
          updatedPreferences?.guests ||
          formData.guests,
      };

      // ==================================================
      // 4. UPDATE REACT STATE
      // ==================================================

      setProfile(updatedProfile);
      setFormData(updatedProfile);

      // ==================================================
      // 5. UPDATE USER LOCAL STORAGE
      // ==================================================

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // NOTE:
      // Lifestyle preferences are NO LONGER stored
      // in localStorage.
      //
      // They are stored in MySQL instead.

      setEditMode(false);

      alert("Profile and preferences updated successfully! ❤️");
    } catch (error) {
      console.error("❌ Profile update error:", error);

      alert(
        "Cannot connect to server. Please make sure the backend is running."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // CANCEL
  // ======================================================

  const handleCancel = () => {
    setFormData({ ...profile });
    setEditMode(false);
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading your profile... 💕</h2>
      </div>
    );
  }

  // ======================================================
  // NO PROFILE
  // ======================================================

  if (!profile || !formData) {
    return null;
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="inner-page">

      {/* ================= NAVBAR ================= */}

      <header className="inner-navbar">

        <Link
          to="/"
          className="dashboard-logo"
        >
          🏠 <span>RoomMate</span> Match
        </Link>

        <Link
          to="/dashboard"
          className="nav-back"
        >
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
                <h1>
                  {profile.name}
                </h1>

                <p>
                  🎓 {profile.role} • 📍{" "}
                  {profile.location || "Location not added"}
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
                    disabled={saving}
                  >
                    {saving
                      ? "💾 Saving..."
                      : "💾 Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="cancel-profile-btn"
                    onClick={handleCancel}
                    disabled={saving}
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

              <span>
                LIFESTYLE
              </span>

              <h2>
                My Preferences
              </h2>

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
                <span>
                  🌙 Sleep Schedule
                </span>

                <strong>
                  {profile.sleep}
                </strong>
              </div>

              <div>
                <span>
                  🧹 Cleanliness
                </span>

                <strong>
                  {profile.cleanliness}
                </strong>
              </div>

              <div>
                <span>
                  🎉 Social Life
                </span>

                <strong>
                  {profile.social}
                </strong>
              </div>

              <div>
                <span>
                  🍳 Food
                </span>

                <strong>
                  {profile.food}
                </strong>
              </div>

              <div>
                <span>
                  📚 Study Environment
                </span>

                <strong>
                  {profile.study}
                </strong>
              </div>

              <div>
                <span>
                  🏠 Guests
                </span>

                <strong>
                  {profile.guests}
                </strong>
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
              {profile.bio || "No bio added yet."}
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
              ✨ Make sure your profile information is
              correct before saving.
            </p>

            <div className="edit-buttons">

              <button
                type="button"
                className="save-profile-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "💾 Saving..."
                  : "💾 Save All Changes"}
              </button>

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancel}
                disabled={saving}
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