package com.example.licenta.controllers;

import com.example.licenta.model.Profesor;
import com.example.licenta.model.Utilizator;
import com.example.licenta.services.SecurityService;
import com.example.licenta.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.Collections;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final SecurityService securityService;


    @Autowired
    public UserController(UserService userService, SecurityService securityService) {
        this.userService = userService;
        this.securityService = securityService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Utilizator loginRequest) {
        try {

            String token = securityService.login(loginRequest.getUsername(), loginRequest.getParola());

            return new ResponseEntity<>(token, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);

        }
    }
    @PostMapping
    public ResponseEntity<Utilizator> createUser(@RequestBody Utilizator utilizator) {
        Utilizator createdUtilizator = userService.insertUser(utilizator);
        return new ResponseEntity<>(createdUtilizator, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilizator> getUserById(@PathVariable Long id) {
        Utilizator utilizator = userService.getUserById(id);
        return ResponseEntity.ok(utilizator);
    }

    @GetMapping
    public ResponseEntity<List<Utilizator>> getAllUsers() {
        List<Utilizator> users = userService.getAllUsers();
        return ResponseEntity.ok(users);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilizator> updateUser(@PathVariable Long id, @RequestBody Utilizator updatedUser) {
        Utilizator utilizator = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(utilizator);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            userService.changeUserPassword(request.getUsername(), request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    static class ChangePasswordRequest {
        private String username;
        private String oldPassword;
        private String newPassword;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
