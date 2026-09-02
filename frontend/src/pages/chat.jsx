import { useState } from "react";
import { Link } from "react-router-dom";

function Chat() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "them",
      text: "Hey! I saw that we have a 94% compatibility match 😊",
      time: "10:20 AM",
    },
    {
      sender: "me",
      text: "Yes! Our lifestyle preferences seem really similar.",
      time: "10:22 AM",
    },
    {
      sender: "them",
      text: "I noticed we both prefer a clean and peaceful place.",
      time: "10:23 AM",
    },
  ]);

  const sendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    setMessages([
      ...messages,
      {
        sender: "me",
        text: trimmedMessage,
        time: "Just now",
      },
    ]);

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">

      {/* HEADER */}

      <header className="chat-header">

        <Link to="/matches" className="chat-back">
          ← Back to Matches
        </Link>

        <div className="chat-user">

          <div className="chat-avatar">
            👩🏻
          </div>

          <div>
            <h2>Priya Sharma</h2>
            <p>
              🟢 Online • 94% Compatible
            </p>
          </div>

        </div>

        <Link
          to="/matches/1"
          className="chat-profile-btn"
        >
          View Profile
        </Link>

      </header>


      {/* CHAT AREA */}

      <main className="chat-container">

        <div className="chat-intro">

          <div className="chat-intro-avatar">
            👩🏻
          </div>

          <h3>Priya Sharma</h3>

          <p>
            Student • Pune
          </p>

          <span>
            You matched with Priya at 94% compatibility ❤️
          </span>

        </div>


        {/* MESSAGES */}

        <div className="messages-container">

          {messages.map((item, index) => (

            <div
              key={index}
              className={`message-row ${
                item.sender === "me"
                  ? "my-message"
                  : "their-message"
              }`}
            >

              {item.sender === "them" && (
                <div className="message-avatar">
                  👩🏻
                </div>
              )}

              <div className="message-wrapper">

                <div className="message-bubble">
                  {item.text}
                </div>

                <span className="message-time">
                  {item.time}
                </span>

              </div>

            </div>

          ))}

        </div>


        {/* MESSAGE INPUT */}

        <div className="chat-input-area">

          <input
            type="text"
            placeholder="Write a message..."
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={sendMessage}
            disabled={!message.trim()}
          >
            Send 💬
          </button>

        </div>

        <p className="chat-safety">
          🛡️ Stay respectful and never share sensitive personal information.
        </p>

      </main>

    </div>
  );
}

export default Chat;