package com.example.licenta.services;

import com.example.licenta.config.EmailSender;
import com.example.licenta.model.Message;
import com.example.licenta.model.Utilizator;
import com.example.licenta.repositories.MessageRepository;
import com.example.licenta.repositories.UtilizatorRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UtilizatorRepository userRepository;

    public MessageService(MessageRepository messageRepository, UtilizatorRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public List<Message> getMessages(String senderUsername, String receiverUsername) {
        Utilizator sender = userRepository.findByUsername(senderUsername);
        Utilizator receiver = userRepository.findByUsername(receiverUsername);

        List<Message> messages = new ArrayList<>();
        messages.addAll(messageRepository.findBySenderAndReceiver(sender, receiver));
        messages.addAll(messageRepository.findBySenderAndReceiver(receiver, sender));
        return messages;
    }

    public void createMessage(Message message) {
        Utilizator sender = userRepository.findByUsername(message.getSender().getUsername());
        Utilizator receiver = userRepository.findByUsername(message.getReceiver().getUsername());


        message.setSender(sender);
        message.setReceiver(receiver);
        message.setTimestamp((new Date()).toString());
        message.setSeen(false);
        messageRepository.save(message);
    }

    public List<Message> getUnreadMessages(String username) {
        Utilizator receiver = userRepository.findByUsername(username);
        return messageRepository.findByReceiverAndSeen(receiver, false);
    }

    public void markMessagesAsSeen(String receiverUsername, String senderUsername) {
        Utilizator receiver = userRepository.findByUsername(receiverUsername);
        Utilizator sender = userRepository.findByUsername(senderUsername);
        List<Message> messages = messageRepository.findBySenderAndReceiver(sender, receiver);
        for (Message message : messages) {
            if (!message.isSeen()) {
                message.setSeen(true);
                messageRepository.save(message);
            }
        }
    }

    @Scheduled(cron = "0 0 0/12 * * ?")
    public void sendUnreadMessagesEmail() {
        List<Message> unreadMessages = messageRepository.findBySeen(false);
        Map<Utilizator, List<Message>> messagesByReceiver = unreadMessages.stream()
                .collect(Collectors.groupingBy(Message::getReceiver));

        messagesByReceiver.forEach((receiver, messages) -> {
            String emailText = buildEmailText(messages);
            try {
                sendEmail(receiver.getUsername(), "Unread Messages Notification", emailText);
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        });
    }

    private String buildEmailText(List<Message> unreadMessages) {
        StringBuilder emailText = new StringBuilder("You have unread messages:\n\n");
        for (Message message : unreadMessages) {
            emailText.append("From: ").append(message.getSender().getUsername())
                    .append("\nMessage: ").append(message.getMessage())
                    .append("\n\n");
        }
        return emailText.toString();
    }

    private void sendEmail(String email, String subject, String text) throws MessagingException {
        EmailSender emailSender = EmailSender.getInstance();
        emailSender.sendEmail(email, subject, text);
    }


}
