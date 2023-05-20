package com.imd.chatweb.controller;

import com.imd.chatweb.model.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @MessageMapping("/message")
    @SendTo("/chat/public")
    public Message getAllMessages(@Payload Message message) {
        return message;
    }

    @MessageMapping("private")
    public Message receiveMessage(@Payload Message message) {
        messagingTemplate.convertAndSendToUser(message.getReceiver(), "private", message);
        return message;
    }
}
