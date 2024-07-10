package com.example.licenta.controllers;

import com.example.licenta.repositories.UtilizatorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.example.licenta.services.MessageService;
import com.example.licenta.services.UserService;
import com.example.licenta.model.Message;
import com.example.licenta.model.Utilizator;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/chat")
public class MessageController {
    private final MessageService messageService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserService userService;
    private final UtilizatorRepository utilizatorRepository;

    @Autowired
    public MessageController(MessageService messageService, SimpMessagingTemplate simpMessagingTemplate, UserService userService, UtilizatorRepository utilizatorRepository) {
        this.messageService = messageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
        this.userService = userService;
        this.utilizatorRepository = utilizatorRepository;
    }

    @PostMapping("/sendMessage")
    public ResponseEntity<String> sendMessage(@RequestBody Message message) {

        Utilizator sender = utilizatorRepository.findByUsername(message.getSender().getUsername());
        Utilizator receiver = utilizatorRepository.findByUsername(message.getReceiver().getUsername());

        message.setSender(sender);
        message.setReceiver(receiver);

        simpMessagingTemplate.convertAndSend("/topic/messages/" + receiver.getUsername() + "/" + sender.getUsername(), message);
        messageService.createMessage(message);
        return ResponseEntity.ok("Message sent!");
    }

    @GetMapping("/getMessages/{senderUsername}/{receiverUsername}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String senderUsername, @PathVariable String receiverUsername) {
        return ResponseEntity.ok(
                messageService.getMessages(senderUsername, receiverUsername).stream()
                        .sorted(Comparator.comparing(Message::getTimestamp))
                        .collect(Collectors.toList()));
    }

    @GetMapping("/getUnreadMessages/{username}")
    public ResponseEntity<List<Message>> getUnreadMessages(@PathVariable String username) {
        return ResponseEntity.ok(messageService.getUnreadMessages(username));
    }

    @PostMapping("/markMessagesAsSeen")
    public ResponseEntity<Void> markMessagesAsSeen(@RequestParam String receiverUsername, @RequestParam String senderUsername) {
        messageService.markMessagesAsSeen(receiverUsername, senderUsername);
        return ResponseEntity.ok().build();
    }
}
