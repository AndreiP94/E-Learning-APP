package com.example.licenta.controllers;

import com.example.licenta.model.Elev;
import com.example.licenta.model.Profesor;
import com.example.licenta.services.ElevService;
import com.example.licenta.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/elevi")
public class ElevController {

    private final ElevService elevService;
    private final SecurityService securityService;


    @Autowired
    public ElevController(ElevService elevService, SecurityService securityService) {
        this.elevService = elevService;
        this.securityService = securityService;
    }

    @PostMapping
    public ResponseEntity<Elev> insertElev(@RequestHeader("Authorization") String auth,@RequestBody Elev elev) {
        String token=securityService.extractToken(auth);
        if(securityService.hasAdminRole(token) && securityService.isValidToken(token)) {
        Elev newElev = elevService.insertElev(elev);
        return ResponseEntity.ok(newElev);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/getElev/{mail}")
    public ResponseEntity<Elev> getElevByMail(@RequestHeader("Authorization") String auth,@PathVariable String mail) {
        String token=securityService.extractToken(auth);
        if(securityService.hasElevRole(token) && securityService.isValidToken(token)) {
        Elev elev=elevService.getElevByEmail(mail);
        return ResponseEntity.ok(elev);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Elev> getElevById(@PathVariable Long id) {
        Elev elev = elevService.getElevById(id);
        return ResponseEntity.ok(elev);
    }

    @GetMapping
    public ResponseEntity<List<Elev>> getAllElevi(@RequestHeader("Authorization") String auth) {
        String token=securityService.extractToken(auth);
        if((securityService.hasAdminRole(token) || securityService.hasProfesorRole(token)) && securityService.isValidToken(token)) {
        List<Elev> elevi = elevService.getAllElevi();
        return ResponseEntity.ok(elevi);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Elev> updateElev(@RequestHeader("Authorization") String auth,@PathVariable Long id, @RequestBody Elev updatedElev) {
        String token=securityService.extractToken(auth);
        if(securityService.hasAdminRole(token) && securityService.isValidToken(token)) {
        Elev elev = elevService.updateElev(id, updatedElev);
        return ResponseEntity.ok(elev);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteElev(@RequestHeader("Authorization") String auth,@PathVariable Long id) {
        String token=securityService.extractToken(auth);
        if(securityService.hasAdminRole(token) && securityService.isValidToken(token)) {
        elevService.deleteElev(id);
        return ResponseEntity.ok().build();
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/changePhoto/{id}/{photo}")
    public ResponseEntity<?> changePhoto(@PathVariable Long id, @PathVariable String photo)
    {
        Elev elev=elevService.updatePhoto(id, photo);
        return ResponseEntity.ok(elev);
    }
}
