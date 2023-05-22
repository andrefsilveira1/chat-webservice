import { useMemo } from "react";
import "./styles.css";

export default function ChatBubble({ isYou, messages, user }) {
  const initials = useMemo(() =>
    user
      .split(" ")
      .map((token) => token[0])
      .join("")
      .toUpperCase()
  );
  return (
    <div className={`bubble-container ${isYou ? "left" : ""}`}>
      <div className="bubble-messages">
        {messages.map((msg) => (
          <p>{msg.message}</p>
        ))}
      </div>
      <div className="profile-picture">{initials}</div>
    </div>
  );
}
