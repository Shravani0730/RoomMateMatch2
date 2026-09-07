import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ConnectedRoommates() {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      window.location.href = "/login";
      return;
    }

    loadConnections();
  }, [userId]);

  const loadConnections = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://backend-production-c6c1.up.railway.app/api/connections/${userId}`
      );

      const data = await response.json();

      console.log("Connected Roommates:", data);

      if (!response.ok || !data.success) {
        setRoommates([]);
        return;
      }

      // Only accepted connections
      const acceptedConnections = (data.connections || []).filter(
        (connection) =>
          connection.status?.toLowerCase() === "accepted"
      );

      // Get the other user's ID
      const otherUserIds = acceptedConnections.map((connection) => {
        const senderId = Number(connection.sender_id);
        const receiverId = Number(connection.receiver_id);
        const currentUserId = Number(userId);

        return senderId === currentUserId
          ? receiverId
          : senderId;
      });

      // Remove duplicate IDs
      const uniqueUserIds = [...new Set(otherUserIds)];

      // Load roommate details
      const roommateResults = await Promise.all(
        uniqueUserIds.map(async (roommateId) => {
          try {
            const userResponse = await fetch(
              `https://backend-production-c6c1.up.railway.app/api/users/${roommateId}`
            );

            const userData = await userResponse.json();

            if (
              userResponse.ok &&
              userData.success &&
              userData.user
            ) {
              return userData.user;
            }

            return null;
          } catch (error) {
            console.error(
              "Roommate details error:",
              error
            );

            return null;
          }
        })
      );

      setRoommates(
        roommateResults.filter(
          (roommate) => roommate !== null
        )
      );
    } catch (error) {
      console.error(
        "Connected roommates error:",
        error
      );

      setRoommates([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="connected-page">

      {/* ================================================
          NAVBAR
      ================================================= */}

      <header className="connected-navbar">

        <Link
          to="/dashboard"
          className="connected-logo"
        >
          🏠 <span>RoomMate</span> Match
        </Link>

        <Link
          to="/dashboard"
          className="connected-back-btn"
        >
          ← Dashboard
        </Link>

      </header>


      {/* ================================================
          MAIN
      ================================================= */}

      <main className="connected-main">

        {/* ================================================
            PAGE HEADER
        ================================================= */}

        <section className="connected-header">

          <span className="connected-eyebrow">
            💕 YOUR CONNECTIONS
          </span>

          <h1>
            Connected Roommates
          </h1>

          <p>
            People you've connected with through
            RoomMate Match.
          </p>

        </section>


        {/* ================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="connected-loading">

            <div className="connected-loading-icon">
              💕
            </div>

            <h3>
              Loading your connections...
            </h3>

            <p>
              Please wait a moment.
            </p>

          </div>
        )}


        {/* ================================================
            EMPTY
        ================================================= */}

        {!loading && roommates.length === 0 && (
          <div className="connected-empty">

            <div className="connected-empty-icon">
              💕
            </div>

            <h2>
              No connected roommates yet
            </h2>

            <p>
              Once someone accepts your connection,
              they'll appear here.
            </p>

            <Link
              to="/matches"
              className="connected-primary-btn"
            >
              Find Roommates →
            </Link>

          </div>
        )}


        {/* ================================================
            ROOMMATES
        ================================================= */}

        {!loading && roommates.length > 0 && (
          <section className="connected-results">

            <div className="connected-count">
              <span>💕</span>
              {roommates.length}{" "}
              {roommates.length === 1
                ? "Connected Roommate"
                : "Connected Roommates"}
            </div>


            <div className="connected-grid">

              {roommates.map((roommate) => (

                <article
                  className="connected-card"
                  key={roommate.id}
                >

                  {/* Avatar */}

                  <div className="connected-avatar">
                    👩🏻
                  </div>


                  {/* Status */}

                  <div className="connected-status">
                    <span></span>
                    Connected
                  </div>


                  {/* Name */}

                  <h2 className="connected-name">
                    {roommate.name || "Roommate"}
                  </h2>


                  {/* Role */}

                  <p className="connected-role">
                    🎓{" "}
                    {roommate.role || "Student"}
                  </p>


                  {/* Location */}

                  <p className="connected-location">
                    📍{" "}
                    {roommate.location || "Location not added"}
                  </p>


                  {/* About */}

                  <div className="connected-about">

                    <span>
                      ABOUT
                    </span>

                    <p>
                      {roommate.bio ||
                        "Looking for a compatible roommate."}
                    </p>

                  </div>


                  {/* Buttons */}

                  <div className="connected-actions">

                    <Link
                      to={`/chat?userId=${roommate.id}`}
                      className="connected-chat-btn"
                    >
                      💬 Start Chat
                    </Link>

                    <Link
                      to={`/matches/${roommate.id}`}
                      className="connected-profile-btn"
                    >
                      View Profile
                    </Link>

                  </div>

                </article>

              ))}

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default ConnectedRoommates;