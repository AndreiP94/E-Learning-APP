package com.example.licenta.repositories;

import com.example.licenta.model.Message;
import com.example.licenta.model.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndReceiver(Utilizator sender, Utilizator receiver);
    List<Message> findByReceiverAndSeen(Utilizator receiver, boolean seen);
    List<Message> findBySeen(boolean seen);
}
