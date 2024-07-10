package com.example.licenta.controllers;

import com.example.licenta.model.Profesor;
import com.example.licenta.services.ProfesorService;
import com.example.licenta.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/profesori")
public class ProfesorController {
    private final ProfesorService profesorService;
    private final SecurityService securityService;

    @Autowired
    public ProfesorController(ProfesorService profesorService, SecurityService securityService) {
        this.profesorService = profesorService;
        this.securityService = securityService;
    }

    @PostMapping
    public ResponseEntity<Profesor> insertProfesor(@RequestHeader("Authorization") String auth, @RequestBody Profesor profesor) {
       String token=securityService.extractToken(auth);
       if(securityService.hasAdminRole(token) && securityService.isValidToken(token)) {
           Profesor newProfesor = profesorService.insertProfesor(profesor);
           return ResponseEntity.ok(newProfesor);
       }
       else
           return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profesor> getProfesorById(@PathVariable Long id) {
        Profesor profesor = profesorService.getProfesorById(id);
        return ResponseEntity.ok(profesor);
    }

    @GetMapping("/getProf/{mail}")
    public ResponseEntity<Profesor> getProfesorById(@RequestHeader("Authorization") String auth,@PathVariable String mail) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
        Profesor profesor = profesorService.getProfesorByMail(mail);
        return ResponseEntity.ok(profesor);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/changePhoto/{id}/{photo}")
    public ResponseEntity<?> changePhoto(@PathVariable Long id, @PathVariable String photo)
    {
        Profesor profesor=profesorService.updatePhoto(id, photo);
        return ResponseEntity.ok(profesor);
    }

    @GetMapping
    public ResponseEntity<List<Profesor>> getAllProfesori(@RequestHeader("Authorization") String auth) {
        String token=securityService.extractToken(auth);
        if(securityService.isValidToken(token)) {
        List<Profesor> profesori = profesorService.getAllProfesori();
        return ResponseEntity.ok(profesori); }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profesor> updateProfesor(@RequestHeader("Authorization") String auth,@PathVariable Long id, @RequestBody Profesor updatedProfesor) {
        String token=securityService.extractToken(auth);
        if(securityService.isValidToken(token)) {
        Profesor profesor = profesorService.updateProfesor(id, updatedProfesor);
        return ResponseEntity.ok(profesor);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesor(@RequestHeader("Authorization") String auth,@PathVariable Long id) {
        String token=securityService.extractToken(auth);
        if(securityService.isValidToken(token)) {
            profesorService.deleteProfesor(id);
            return ResponseEntity.ok().build();}
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}
