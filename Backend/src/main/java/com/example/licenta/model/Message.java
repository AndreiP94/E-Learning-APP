package com.example.licenta.model;

import javax.persistence.*;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    private Utilizator sender;
    @ManyToOne
    private Utilizator receiver;
    private String message;
    private String timestamp;
    private boolean seen = false;


    public boolean isSeen() {
        return seen;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utilizator getSender() {
        return sender;
    }

    public void setSender(Utilizator sender) {
        this.sender = sender;
    }

    public Utilizator getReceiver() {
        return receiver;
    }

    public void setReceiver(Utilizator receiver) {
        this.receiver = receiver;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
