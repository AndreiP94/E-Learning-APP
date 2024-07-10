package com.example.licenta.controllers;

import com.example.licenta.model.Lectie;
import com.example.licenta.services.LectieService;
import com.example.licenta.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/lectii")
public class LectieController {

    private final LectieService lectieService;
    private final SecurityService securityService;


    @Autowired
    public LectieController(LectieService lectieService, SecurityService securityService) {
        this.lectieService = lectieService;
        this.securityService = securityService;
    }

    @PostMapping
    public ResponseEntity<Lectie> createLectie(@RequestHeader("Authorization") String auth,@RequestBody Lectie lectie) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
        Lectie newLectie = lectieService.insertLectie(lectie);
        return ResponseEntity.ok(newLectie);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/curs/{cursId}")
    public ResponseEntity<Lectie> addLectieToCurs(@PathVariable Long cursId, @RequestBody Lectie lectie) {
        Lectie newLectie = lectieService.addLectieToCurs(cursId, lectie);
        return ResponseEntity.ok(newLectie);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lectie> getLectieById(@PathVariable Long id) {
        Lectie lectie = lectieService.getLectieById(id);
        return ResponseEntity.ok(lectie);
    }

    @GetMapping("/curs/{cursId}")
    public ResponseEntity<List<Lectie>> getLectiiByCursId(@RequestHeader("Authorization") String auth,@PathVariable Long cursId) {
        String token=securityService.extractToken(auth);
        if((securityService.hasProfesorRole(token) ||securityService.hasElevRole(token)) && securityService.isValidToken(token)) {
            List<Lectie> lectii = lectieService.getLectiiByCursId(cursId);
        return ResponseEntity.ok(lectii);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping
    public ResponseEntity<List<Lectie>> getAllLectii() {
        List<Lectie> lectii = lectieService.getAllLectii();
        return ResponseEntity.ok(lectii);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lectie> updateLectie(@RequestHeader("Authorization") String auth,@PathVariable Long id, @RequestBody Lectie updatedLectie) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
            Lectie lectie = lectieService.updateLectie(id, updatedLectie);
            return ResponseEntity.ok(lectie);
        }
         else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLectie(@RequestHeader("Authorization") String auth,@PathVariable Long id) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
        lectieService.deleteLectie(id);
        return ResponseEntity.ok().build();
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}
