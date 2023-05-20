import React, { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";

var stomClient = null;
export default function Chat() {
    const [clientData, setClientData] = useState({
        name:"",
        receiver:"",
        connected: false,
        message:"",
    });
    const [publicRoom, setPublicRoom] = useState([]);
    const [privateRoom, setPrivateRoom] = useState(new Map());
    const [room, setRoom] = useState("ROOM");

    function handleValue(e) {
        const {value, name} = e.target
        setClientData({...clientData, [name]: value});
    }

    function handleName(e) {
        const value = e.target;
        setClientData({...clientData, "name" : value})
    }

    function handleMessage(e) {
        const {value} = e.target;
        setClientData({...clientData, "message" : value})
    }

    function createClient() {
        let Sock = new SockJS("http://localhost:8080/ws");
        stomClient=over(Sock);
        stomClient.connect({}, onConnected, onError);
    }

    function onConnected() {
        setClientData({...clientData, "connected":true});
        stomClient.subscribe("/chat/public", onPublic);
        stomClient.subscribe("/user/"+clientData.name+"/private", onPrivate);
        clientConnected();
    }
    function clientConnected() {
        let message = {
            senderName: clientData.name,
            status: "JOIN",
        };
        stomClient.send("/app/message", {}, JSON.stringify(message));
    }

    function onError(error) {
        console.log("ERROR:", error)
    }

    function onPublic(payload) {
        let payloadData = JSON.parse(payload.body);
        switch(payloadData.status) {
            case "JOIN":
                if(!privateRoom.get(payloadData.senderName)) {
                    privateRoom.set(payloadData.senderName, []);
                    setPrivateRoom(new Map(privateRoom));
                }
                break;
            case "MESSAGE":
                publicRoom.push(payloadData);
                setPublicRoom([... publicRoom]);
                break;
        }
    }

    function sendMessagePublic() {
        if(stomClient) {
            var chatmessage = {
                senderName: clientData.name,
                message: clientData.message,
                status: "MESSAGE",
            };
            console.log("CHATMESSAGE:",chatmessage);
            stomClient.send("/app/message", {}, JSON.stringify(chatmessage));
            setClientData({...clientData, "message":""});
        }
    }

    function sendMessagePrivate() {
        if(stomClient) {
            let message = {
                senderName: clientData.name,
                receiver: room,
                message: clientData.message,
                status: "MESSAGE",
            };
            if(clientData.name !== room) {
                privateRoom.set(room).push(message);
                setPrivateRoom(new Map(privateRoom));
            }
            stomClient.send("/app/message", {}, JSON.stringify(message));
            setClientData({...clientData, "message":""});
        }
    }

    function onPrivate(payload) {
        let payloadData = JSON.parse(payload);
        if(privateRoom.get(payloadData.senderName)) {
            let data = [];
            data.push(payloadData);
            privateRoom.set(payloadData.senderName, data);
            setPrivateRoom(new Map(privateRoom));
        }
    }

    return(
        <div>
            <h1>CHAT</h1>
            <div className="container">
                {console.log("CLIENTEE:", clientData.connected)}
                {console.log("MENSAGEM:", clientData.message)}

                {clientData.connected? 
                <div>
                    <div>
                        <ul>
                            <li onClick={() => {setRoom("ROOM")}} >Room</li>
                            {[...privateRoom.keys()].map((name, index) => (
                                <li key={index} onClick={setRoom(name)} > {name} </li>
                            ))}
                        </ul>
                    </div>
                    {room === "ROOM" &&
                    <div>
                        <ul>
                            {publicRoom.map((chat, index) => (
                                <li key={index} className={`message ${chat.senderName === clientData.name && "self"} `}>
                                    {chat.senderName !== clientData.name && <div>{chat.senderName}</div>}
                                    <div>{chat.message}</div>
                                    {console.log("CHAT MESSAGEEE:", chat.message)}
                                    {chat.senderName === clientData.name && <div>{chat.senderName}</div>}
                                </li>
                            ))}
                        </ul>

                    <div>
                        <input type="text" placeholder="Enter your message" name="message" value={clientData.message} onChange={handleMessage}/>
                        <button type="button" onClick={sendMessagePublic}>Enviar</button>
                    </div>
                </div>} 
                    {/* {room !== "ROOM" &&
                    <div>
                        {...privateRoom.get(room).map((chat, index) => (
                            <li key={index}>
                                {chat.senderName !== clientData.name && <div>{chat.senderName}</div>}
                                <div>{chat.message}</div>
                                {chat.senderName === clientData.name && <div>{chat.senderName}</div>}
                            </li>
                        ))}
                    </div>} */}

                </div> 
                :

                <div>
                    <input name="name" value={clientData.name} onChange={handleValue}></input>
                    <button type="button" onClick={createClient}>Enter</button>
                </div>
            }
            </div>
        </div>
    )
}