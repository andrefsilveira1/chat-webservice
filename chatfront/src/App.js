import { useState } from "react";
import Chat from "./components/chat";
import "./index.css";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import RegisterScreen from "./components/RegisterScreen";
import ChatScreen from "./components/ChatScreen";

let stomClient = null;

function App() {
  const [connected, setConnected] = useState(false);
  const [name, setName] = useState("");
  const [publicRoom, setPublicRoom] = useState([]);
  const [privateRoom, setPrivateRoom] = useState(new Map());

  function register(e) {
    e.preventDefault();
    const Sock = new SockJS("http://localhost:8080/ws");
    stomClient = over(Sock);
    stomClient.connect({}, onConnected, (err) =>
      alert(`An error has occurred: ${err}`)
    );
  }

  function onConnected() {
    setConnected(true);
    stomClient.subscribe("/chat/public", onPublic);
    stomClient.subscribe("/user/" + name + "/private", onPrivate);
    stomClient.send(
      "/app/message",
      {},
      JSON.stringify({ author: name, status: "JOIN" })
    );
  }

  function onPublic(payload) {
    console.log(payload);
    let payloadData = JSON.parse(payload.body);
    if (payload.status === "JOIN") {
      if (!privateRoom.get(payloadData.senderName)) {
        privateRoom.set(payloadData.senderName, []);
        setPrivateRoom(new Map(privateRoom));
      }
    } else {
      publicRoom.push(payloadData);
      setPublicRoom([...publicRoom]);
    }
  }

  function onPrivate(payload) {
    let payloadData = JSON.parse(payload);
    if (privateRoom.get(payloadData.name)) {
      let data = [];
      data.push(payloadData);
      privateRoom.set(payloadData.name, data);
      setPrivateRoom(new Map(privateRoom));
    }
  }

  function sendMessage(message) {
    if (stomClient) {
      var chatMsg = {
        author: name,
        message: message,
        status: "MESSAGE",
      };
      stomClient.send("/app/message", {}, JSON.stringify(chatMsg));
    }
  }

  if (!connected) {
    return <RegisterScreen name={name} setName={setName} register={register} />;
  }

  return (
    <ChatScreen
      messages={publicRoom.filter((msg) => msg.message !== null)}
      sendMessage={sendMessage}
      user={name}
    />
  );
}

export default App;
