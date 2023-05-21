import React, { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import "./index.css"

var stomClient = null;
export function Chat() {
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
        clientConnected();
    }
    function clientConnected() {
        let client = {
            author: clientData.name,
            message: "connected",
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

    return(
            <div>
                <h1>ChatgpD</h1>
            <div className="container ">
                {clientData.connected? 
                <>
                <div>
                    <div className="chat-content">
                        <div className="box rounded mt-5">
                            <ul className="chat-messages list-group list-group-flush">
                               
                                {publicRoom.map((chat, index) => (
                                    <>
                                    {chat.message === "connected" && chat.author !== clientData.name ? <small key={index} className="list-group-item text-secondary d-flex justify-content-center"> User ({chat.author}) has joined the Server!</small> : ''}
                                        {
                                        chat.message !== null && chat.message !== "connected" && 
                                        <li key={index} className={`message list-group-item`}>
                                            {
                                                chat.author !== clientData.name? <div className="message-data">{chat.author}: {chat.message}</div>
                                                :<div className="message-data">You: {chat.message}</div>
                                            }
                                        </li>
                                        }
                                    </>
                                ))}
                            </ul>
                        </div>
                        <div className="send-message d-flex mt-2">
                            <input type="text" className="form-control m-2" placeholder="Enter your message" name="message" onKeyUp={handleKey} value={clientData.message} onChange={handleMessage}/>
                            <button type="button" className="btn btn-primary m-2" onClick={sendMessagePublic}>Enviar</button>
                        </div>
                    </div>
                </div>
                </>
                :

                <div className="form-group d-flex mt-5  align-items-center justify-content-center">
                    <label >Name: </label>
                    <input placeholder="Insert your name" className="form-control m-2" name="name" value={clientData.name} onChange={handleValue} onKeyUp={handleKey}></input>
                    <button type="button" name="name" className="btn btn-primary" onClick={registerClient}>Enter</button>
                </div>
            }
            </div>
        </div>
    )
}