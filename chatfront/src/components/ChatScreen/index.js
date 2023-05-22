import { useState, useMemo } from "react";
import Input from "../Input";
import Button from "../Button";
import ChatBubble from "../ChatBubble";
import "./styles.css";

export default function ChatScreen({ messages, sendMessage, user }) {
  const [message, setMessage] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  }

  const groupedMessages = useMemo(
    () =>
      messages.reduce((acc, current, i) => {
        if (i === 0 || acc[acc.length - 1][0]?.author !== current.author) {
          acc.push([current]);
        } else {
          acc[acc.length - 1].push(current);
        }
        return acc;
      }, []),
    [messages]
  );

  return (
    <div className="chat-container">
      <h1 style={{ marginBottom: "3rem" }}>chatgpD - {user}</h1>
      <div className="messages">
        {groupedMessages.map((group) => (
          <ChatBubble
            messages={group}
            isYou={group[0]?.author === user}
            user={group[0].author}
          />
        ))}
      </div>

      <form className="send-form" onSubmit={onSubmit}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            paddingTop: "2.4rem",
            paddingBottom: "2.4rem",
            borderRadius: "12px",
            fontSize: "1.8rem",
            width: "88%",
          }}
        />
        <Button style={{ width: "10%" }}>Enviar</Button>
      </form>
    </div>
  );
}
