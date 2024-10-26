package com.chatapp.controller;

import com.chatapp.model.MessageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/groupMessage/{groupId}")
    public void sendGroupMessage(SimpMessageHeaderAccessor sha, @Payload MessageRequest message) {
        String groupId = message.getGroupId();
        String msg = "msg: "+message.getContent()+"senderId: " + message.getSenderId();
        simpMessagingTemplate.convertAndSend("/topic/messages/" + groupId, msg);
    }
}