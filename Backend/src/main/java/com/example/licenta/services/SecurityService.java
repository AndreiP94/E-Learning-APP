package com.example.licenta.services;

import com.example.licenta.model.Utilizator;
import com.example.licenta.repositories.UtilizatorRepository;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;
import java.util.List;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

@Service
public class SecurityService
{
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    private static final long EXPIRATION_TIME = 3_600_000;

    private final UtilizatorRepository utilizatorRepository;

    public SecurityService(UtilizatorRepository utilizatorRepository) {
        this.utilizatorRepository = utilizatorRepository;
    }

    public String login(String username, String pass)
    {
        List<Utilizator> personList = utilizatorRepository.findAll();
        for (Utilizator person : personList) {
            if (person.getUsername().equals(username.trim()) && person.getParola().equals(pass.trim())) {
                String role = person.getRol();
                String token = Jwts.builder()
                        .setSubject(username)
                        .claim("role", role)
                        .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                        .signWith(SECRET_KEY)
                        .compact();
                Claims claims = Jwts.parser()
                        .setSigningKey(SECRET_KEY)
                        .parseClaimsJws(token)
                        .getBody();
                return token;
            }
        }
        throw new RuntimeException("Autentificare eșuată: Nume de utilizator sau parolă incorecte");
    }

    public String extractToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }

    public boolean isValidToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean hasAdminRole(String token) {
        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        String role = claims.get("role", String.class);
        return role != null && role.equals("admin");
    }
    public boolean hasProfesorRole(String token) {
        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        String role = claims.get("role", String.class);
        return role != null && role.equals("profesor");
    }

    public boolean hasElevRole(String token) {
        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        String role = claims.get("role", String.class);
        return role != null && role.equals("elev");
    }


}
