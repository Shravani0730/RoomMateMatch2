import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const [otherUser, setOtherUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET CHAT USER
  // =====================================================

  const getChatUserId = () => {
    const urlUserId = searchParams.get("userId");

    if (urlUserId) {
      localStorage.setItem("chatUserId", urlUserId);
      return urlUserId;
    }

    return localStorage.getItem("chatUserId");
  };

  // =====================================================
  // LOAD CHAT
  // =====================================================

  useEffect(() => {
    const load = async () => {
      const userId = localStorage.getItem("userId");
      const chatUserId = getChatUserId();

      console.log("========== CHAT ==========");
      console.log("Current User:", userId);
      console.log("Chat User:", chatUserId);
      console.log("==========================");

      // No logged-in user
      if (!userId) {
        navigate("/login");
        return;
      }

      // No roommate selected
      if (!chatUserId) {
        setError("No roommate selected.");
        setLoading(false);
        return;
      }

      await loadChat(
        Number(userId),
        Number(chatUserId)
      );
    };

    load();
  }, [navigate, searchParams]);

  // =====================================================
  // LOAD CHAT DATA
  // =====================================================

  const loadChat = async (userId, chatUserId) => {
    try {
      setLoading(true);
      setError("");

      // -------------------------------------------------
      // GET OTHER USER
      // -------------------------------------------------

      const userResponse = await fetch(
        `https://backend-production-c6c1.up.railway.app/api/users/${chatUserId}`
      );

      if (!userResponse.ok) {
        throw new Error("Could not load roommate profile.");
      }

      const userData = await userResponse.json();

      console.log("Roommate:", userData);

      if (
        !userData.success ||
        !userData.user
      ) {
        throw new Error("Roommate profile not found.");
      }

      setOtherUser(userData.user);

      // -------------------------------------------------
      // GET MESSAGES
      // -------------------------------------------------

      const messagesResponse = await fetch(
        `https://backend-production-c6c1.up.railway.app/api/chat/${userId}/${chatUserId}`
      );

      if (!messagesResponse.ok) {
        throw new Error("Could not load messages.");
      }

      const messagesData =
        await messagesResponse.json();

      console.log("Messages:", messagesData);

      if (messagesData.success) {
        setMessages(
          messagesData.messages || []
        );
      } else {
        setMessages([]);
      }

    } catch (err) {
      console.error("Chat error:", err);

      setError(
        err.message ||
          "Unable to open chat."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = async (e) => {
    e.preventDefault();

    const userId =
      localStorage.getItem("userId");

    const chatUserId =
      localStorage.getItem("chatUserId");

    const cleanMessage =
      messageText.trim();

    if (!cleanMessage) {
      return;
    }

    if (!userId || !chatUserId) {
      alert("Chat information is missing.");
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        "https://backend-production-c6c1.up.railway.app/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            sender_id: Number(userId),
            receiver_id: Number(chatUserId),
            message: cleanMessage,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Send message response:",
        data
      );

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Message could not be sent."
        );
      }

      // Add new message immediately
      if (data.chat) {
        setMessages((previous) => [
          ...previous,
          data.chat,
        ]);
      }

      setMessageText("");

    } catch (err) {
      console.error(
        "Send message error:",
        err
      );

      alert(
        err.message ||
          "Unable to send message."
      );

    } finally {
      setSending(false);
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div className="chat-page">
        <div className="chat-loading">

          <div className="no-messages-icon">
            💕
          </div>

          <h2>
            Opening your chat...
          </h2>

          <p>
            Loading your roommate conversation.
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR SCREEN
  // =====================================================

  if (error || !otherUser) {
    return (
      <div className="chat-page">

        <div className="chat-unavailable">

          <div className="no-messages-icon">
            💔
          </div>

          <h2>
            Chat unavailable
          </h2>

          <p>
            {error ||
              "Please select a roommate first."}
          </p>

          <Link
            to="/matches"
            className="chat-back-button"
          >
            ← Back to Matches
          </Link>

        </div>

      </div>
    );
  }

  // =====================================================
  // CURRENT USER
  // =====================================================

  const currentUserId = Number(
    localStorage.getItem("userId")
  );

  // =====================================================
  // CHAT UI
  // =====================================================

  return (
    <div className="chat-page">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <header className="chat-header">

        <Link
          to="/matches"
          className="chat-back"
        >
          ←
        </Link>

        <div className="chat-user-avatar">
          👩🏻
        </div>

        <div className="chat-user-info">

          <h2>
            {otherUser.name || "Roommate"}
          </h2>

          <span>
            {otherUser.role || "Student"}
          </span>

        </div>

      </header>

      {/* ============================================= */}
      {/* MESSAGES */}
      {/* ============================================= */}

      <main className="chat-messages">

        {messages.length === 0 ? (

          <div className="no-messages">

            <div className="no-messages-icon">
              💕
            </div>

            <h3>
              Start a conversation
            </h3>

            <p>
              Say hello to{" "}
              {otherUser.name ||
                "your potential roommate"}!
            </p>

          </div>

        ) : (

          messages.map((msg) => {

            const isMine =
              Number(msg.sender_id) ===
              currentUserId;

            return (
              <div
                key={msg.id}
                className={
                  isMine
                    ? "message-row mine"
                    : "message-row"
                }
              >

                <div
                  className={
                    isMine
                      ? "message-bubble mine"
                      : "message-bubble"
                  }
                >

                  <p>
                    {msg.message}
                  </p>

                  <span>
                    {new Date(
                      msg.created_at
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>

                </div>

              </div>
            );
          })

        )}

      </main>

      {/* ============================================= */}
      {/* MESSAGE INPUT */}
      {/* ============================================= */}

      <form
        className="chat-input-area"
        onSubmit={sendMessage}
      >

        <input
          type="text"
          value={messageText}
          onChange={(e) =>
            setMessageText(
              e.target.value
            )
          }
          placeholder="Write a message..."
          disabled={sending}
        />

        <button
          type="submit"
          disabled={
            sending ||
            !messageText.trim()
          }
        >
          {sending
            ? "Sending..."
            : "Send 💕"}
        </button>

      </form>

    </div>
  );
}

export default Chat;