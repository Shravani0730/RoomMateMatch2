import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login");
      return;
    }

    loadNotifications(userId);
  }, [navigate]);

  // =====================================================
  // GET CONNECTIONS
  // =====================================================

  const loadNotifications = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `https://backend-production-c6c1.up.railway.app/api/connections/${userId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }

      const data = await response.json();

      console.log("Notifications:", data);

      if (!data.success) {
        setError(
          data.message || "Could not load notifications."
        );
        setNotifications([]);
        return;
      }

      const connectionNotifications = (
        data.connections || []
      ).map((connection) => {
        const isIncoming =
          Number(connection.receiver_id) === Number(userId);

        const otherUser = isIncoming
          ? connection.sender_name
          : connection.receiver_name;

        const otherUserId = isIncoming
          ? connection.sender_id
          : connection.receiver_id;

        // -----------------------------
        // PENDING
        // -----------------------------

        if (connection.status === "pending") {
          return {
            id: `connection-${connection.id}`,
            connectionId: connection.id,
            type: isIncoming ? "request" : "sent",
            icon: isIncoming ? "💕" : "💌",

            title: isIncoming
              ? "New connection request"
              : "Connection request sent",

            message: isIncoming
              ? `${otherUser} wants to connect with you.`
              : `Your connection request to ${otherUser} is pending.`,

            time: formatTime(connection.created_at),

            unread: isIncoming,
            status: "pending",
            incoming: isIncoming,
            otherUserId,
            otherUserName: otherUser,
          };
        }

        // -----------------------------
        // ACCEPTED
        // -----------------------------

        if (connection.status === "accepted") {
          return {
            id: `connection-${connection.id}`,
            connectionId: connection.id,
            type: "accepted",
            icon: "💚",

            title: "Connection accepted!",

            message: `${otherUser} accepted your roommate connection.`,

            time: formatTime(
              connection.updated_at ||
                connection.created_at
            ),

            unread: false,
            status: "accepted",
            incoming: isIncoming,
            otherUserId,
            otherUserName: otherUser,
          };
        }

        // -----------------------------
        // REJECTED
        // -----------------------------

        return {
          id: `connection-${connection.id}`,
          connectionId: connection.id,
          type: "rejected",
          icon: "💔",

          title: "Connection request declined",

          message: `${otherUser} declined the roommate connection request.`,

          time: formatTime(
            connection.updated_at ||
              connection.created_at
          ),

          unread: false,
          status: "rejected",
          incoming: isIncoming,
          otherUserId,
          otherUserName: otherUser,
        };
      });

      setNotifications(connectionNotifications);
    } catch (err) {
      console.error("Notifications error:", err);

      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE CONNECTION STATUS
  // =====================================================

  const updateConnection = async (
    connectionId,
    status
  ) => {
    try {
      setActionLoading(connectionId);

      const response = await fetch(
        `https://backend-production-c6c1.up.railway.app/api/connections/${connectionId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      console.log(
        `${status} connection:`,
        data
      );

      if (!data.success) {
        alert(
          data.message ||
            `Could not ${status} connection.`
        );

        return;
      }

      const userId =
        localStorage.getItem("userId");

      await loadNotifications(userId);
    } catch (err) {
      console.error(
        `${status} connection error:`,
        err
      );

      alert(
        "Unable to update connection. Make sure the backend is running."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // OPEN CHAT
  // =====================================================

  const openChat = (otherUserId) => {
  if (!otherUserId) {
    alert("Roommate information is unavailable.");
    return;
  }

  localStorage.setItem(
    "chatUserId",
    String(otherUserId)
  );

  navigate(
    `/chat?userId=${otherUserId}`
  );
};

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const markAllAsRead = () => {
    setNotifications(
      (previousNotifications) =>
        previousNotifications.map(
          (notification) => ({
            ...notification,
            unread: false,
          })
        )
    );
  };

  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);
    const now = new Date();

    const difference = Math.floor(
      (now - date) / 1000
    );

    if (difference < 60) {
      return "Just now";
    }

    if (difference < 3600) {
      return `${Math.floor(
        difference / 60
      )} minutes ago`;
    }

    if (difference < 86400) {
      return `${Math.floor(
        difference / 3600
      )} hours ago`;
    }

    if (difference < 604800) {
      return `${Math.floor(
        difference / 86400
      )} days ago`;
    }

    return date.toLocaleDateString();
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="inner-page">

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

        <main className="notifications-page">

          <div className="notifications-empty">

            <div className="notification-empty-icon">
              💕
            </div>

            <h2>
              Loading notifications...
            </h2>

            <p>
              Checking your roommate activity.
            </p>

          </div>

        </main>

      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="inner-page">

      {/* ================================================= */}
      {/* NAVBAR */}
      {/* ================================================= */}

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


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="notifications-page">

        {/* HEADER */}

        <div className="notifications-header">

          <div>

            <span className="profile-label">
              NOTIFICATIONS
            </span>

            <h1>
              Your Updates
            </h1>

            <p>
              Stay updated with your roommate
              activity.
            </p>

          </div>

          {notifications.length > 0 && (
            <button
              className="mark-read-btn"
              onClick={markAllAsRead}
            >
              ✓ Mark all as read
            </button>
          )}

        </div>


        {/* ERROR */}

        {error && (
          <div className="notification-error">
            ⚠️ {error}
          </div>
        )}


        {/* EMPTY */}

        {!error &&
          notifications.length === 0 && (
            <section className="notifications-empty">

              <div className="notification-empty-icon">
                🔔
              </div>

              <h2>
                No notifications yet
              </h2>

              <p>
                Your roommate activity will
                appear here.
              </p>

              <Link
                to="/matches"
                className="dashboard-quiz-btn"
              >
                Find Roommates ❤️
              </Link>

            </section>
          )}


        {/* NOTIFICATION LIST */}

        {notifications.length > 0 && (

          <section className="notifications-list">

            {notifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={`notification-card ${
                    notification.unread
                      ? "unread"
                      : ""
                  }`}
                >

                  {/* ICON */}

                  <div className="notification-icon">
                    {notification.icon}
                  </div>


                  {/* CONTENT */}

                  <div className="notification-content">

                    <h3>
                      {notification.title}
                    </h3>

                    <p>
                      {notification.message}
                    </p>

                    <span>
                      {notification.time}
                    </span>


                    {/* ================================================= */}
                    {/* INCOMING PENDING REQUEST */}
                    {/* ================================================= */}

                    {notification.incoming &&
                      notification.status ===
                        "pending" && (

                        <div className="notification-actions">

                          <button
                            className="accept-btn"
                            disabled={
                              actionLoading ===
                              notification.connectionId
                            }
                            onClick={() =>
                              updateConnection(
                                notification.connectionId,
                                "accepted"
                              )
                            }
                          >
                            {actionLoading ===
                            notification.connectionId
                              ? "Processing..."
                              : "💚 Accept"}
                          </button>


                          <button
                            className="reject-btn"
                            disabled={
                              actionLoading ===
                              notification.connectionId
                            }
                            onClick={() =>
                              updateConnection(
                                notification.connectionId,
                                "rejected"
                              )
                            }
                          >
                            ✕ Reject
                          </button>

                        </div>
                      )}


                    {/* ================================================= */}
                    {/* ACCEPTED CONNECTION */}
                    {/* ================================================= */}

                    {notification.status ===
                      "accepted" && (

                      <button
                        className="notification-chat-btn"
                        onClick={() =>
                          openChat(
                            notification.otherUserId
                          )
                        }
                      >
                        💬 Send Message
                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </section>

        )}

      </main>

    </div>
  );
}

export default Notifications;