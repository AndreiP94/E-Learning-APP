package com.example.licenta.services;

import com.example.licenta.config.EmailSender;
import com.example.licenta.model.Utilizator;
import com.example.licenta.repositories.UtilizatorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.security.Key;
import java.security.SecureRandom;
import java.util.Date;
import java.util.List;
import java.util.Random;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    private final UtilizatorRepository utilizatorRepository;

    @Autowired
    public UserService(UtilizatorRepository utilizatorRepository) {
        this.utilizatorRepository = utilizatorRepository;
    }

    private static final Random RANDOM = new SecureRandom();
    private static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int PASSWORD_LENGTH = 12;
    public String generateRandomPassword() {
        StringBuilder returnValue = new StringBuilder(PASSWORD_LENGTH);
        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            returnValue.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return returnValue.toString();
    }

    public void changeUserPassword(String username, String oldPassword, String newPassword) {
        Utilizator utilizator = utilizatorRepository.findByUsername(username);

        if (utilizator != null && utilizator.getParola().equals(oldPassword)) {
            utilizator.setParola(newPassword);
            utilizatorRepository.save(utilizator);
            this.sendEmailNewParola(username, newPassword);
        } else {
            System.out.println("User negasit sau parola veche nu corespunde.");
        }
    }

    public void sendEmailNewParola(String email, String parola) {
        try {
            EmailSender emailSender = EmailSender.getInstance();
            emailSender.sendEmail(email, "parola schimbata", "Parola dumneavoastra a fost schimbata cu succes. Noua parola este: " + parola);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    public void sendEmailParolaGenerata(String email, String parola) {
        try {
            EmailSender emailSender = EmailSender.getInstance();
            emailSender.sendEmail(email, "cont nou", "Contul dumneavoastra a fost creat cu succes. Parola generata este:  " + parola + ". Pentru securitate, va rugam sa va schimbati parola la logare");
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }


    public Utilizator insertUser(Utilizator utilizator) {
        return utilizatorRepository.save(utilizator);
    }

    public Utilizator getUserById(Long id) {
        return utilizatorRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Utilizator> getAllUsers() {
        return utilizatorRepository.findAll();
    }

    public Utilizator updateUser(Long id, Utilizator updatedUser) {
        Utilizator utilizator = utilizatorRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        utilizator.setUsername(updatedUser.getUsername());
        utilizator.setParola(updatedUser.getParola());
        utilizator.setRol(updatedUser.getRol());
        return utilizatorRepository.save(utilizator);
    }

    public void deleteUser(Long id) {
        utilizatorRepository.deleteById(id);
    }

    }


