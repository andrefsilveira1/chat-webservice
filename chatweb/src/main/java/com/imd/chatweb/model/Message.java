package com.imd.chatweb.model;

import lombok.ToString;

@ToString
public class Message {
    private String author;
    private String receiver;
    private String message;

    public Message() {

    }

    public Message(String author, String receiver, String message, String date, Status status) {
        this.author = author;
        this.receiver = receiver;
        this.message = message;
        this.date = date;
        this.status = status;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getReceiver() {
        return receiver;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    private String date;
    private Status status;
}
