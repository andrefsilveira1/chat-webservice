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

    function handleValue(e) {
        const {value, name} = e.target
        setClientData({...clientData, [name]: value});
    }

    function handleMessage(e) {
        const {value} = e.target;
        setClientData({...clientData, "message" : value})
    }

    function registerClient() {
        createClient();
    }

    function handleKey(e) {
        if(e.key === "Enter" && e.target.name === "name"){
            registerClient();
        }else if (e.key === "Enter" && e.target.name === "message") {
            sendMessagePublic();
        }
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
        let client = {
            author: clientData.name,
            status: "JOIN",
        };
        stomClient.send("/app/message", {}, JSON.stringify(client));
    }

    function onError(error) {
        alert("Error:", error);
    }

    function onPublic(payload) {
        let payloadData = JSON.parse(payload.body);
        if(payload.status === "JOIN") {
            if(!privateRoom.get(payloadData.senderName)) {
                privateRoom.set(payloadData.senderName, []);
                setPrivateRoom(new Map(privateRoom));
            }
        } else {
            publicRoom.push(payloadData);
            setPublicRoom([...publicRoom]);
        }
    }

    function sendMessagePublic() {
        if(stomClient) {
            var chatmessage = {
                author: clientData.name,
                message: clientData.message,
                status: "MESSAGE",
            };
            stomClient.send("/app/message", {}, JSON.stringify(chatmessage));
            setClientData({...clientData, "message":""});
        }
    }

    // Essa função pode ser usada para mandar mensagem privada
    // function sendMessagePrivate() {
    //     if(stomClient) {
    //         let message = {
    //             name: clientData.name,
    //             receiver: room,
    //             message: clientData.message,
    //             status: "MESSAGE",
    //         };
    //         if(clientData.name !== room) {
    //             privateRoom.set(room).push(message);
    //             setPrivateRoom(new Map(privateRoom));
    //         }
    //         stomClient.send("/app/message", {}, JSON.stringify(message));
    //         setClientData({...clientData, "message":""});
    //     }
    // }

    function onPrivate(payload) {
        let payloadData = JSON.parse(payload);
        if(privateRoom.get(payloadData.name)) {
            let data = [];
            data.push(payloadData);
            privateRoom.set(payloadData.name, data);
            setPrivateRoom(new Map(privateRoom));
        }
    }

    return(
            <div>
            <h1>ChatgpD</h1>
            <div className="container">
                {clientData.connected? 
                <div>
                    <div className="chat-content">
                        <ul className="chat-messages list-group list-group-flush">
                            {publicRoom.map((chat, index) => (
                                <>
                                    {
                                    chat.message !== null &&
                                    <li key={index} className={`message list-group-item`}>
                                        {
                                            chat.message !== null && chat.author !== clientData.name ? <div className="message-data">{chat.author}: {chat.message}</div>
                                            :<div className="message-data">You: {chat.message}</div>
                                        }
                                    </li>
                                    }
                                </>
                            ))}
                        </ul>

                    <div className="send-message d-flex">
                        <input type="text" className="form-control m-2" placeholder="Enter your message" name="message" onKeyUp={handleKey} value={clientData.message} onChange={handleMessage}/>
                        <button type="button" className="btn btn-primary m-2" onClick={sendMessagePublic}>Enviar</button>
                    </div>
                    </div>
                </div>
                :

                <div className="form-group d-flex h-100  align-items-center justify-content-center">
                    <label >Name: </label>
                    <input placeholder="Insert your name" className="form-control m-2" name="name" value={clientData.name} onChange={handleValue} onKeyUp={handleKey}></input>
                    <button type="button" name="name" className="btn btn-primary" onClick={registerClient}>Enter</button>
                </div>
            }
            </div>
        </div>
    )
}