package com.example.licenta.controllers;

import com.example.licenta.model.Curs;
import com.example.licenta.model.Elev;
import com.example.licenta.services.CursService;
import com.example.licenta.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/cursuri")
public class CursController {

    private final CursService cursService;
    private final SecurityService securityService;


    @Autowired
    public CursController(CursService cursService, SecurityService securityService) {
        this.cursService = cursService;
        this.securityService = securityService;
    }

    @PostMapping
    public ResponseEntity<Curs> insertCurs(@RequestHeader("Authorization") String auth,@RequestBody Curs curs) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
        Curs newCurs = cursService.insertCurs(curs);
        return ResponseEntity.ok(newCurs);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curs> getCursById(@PathVariable Long id) {
        Curs curs = cursService.getCursById(id);
        return ResponseEntity.ok(curs);
    }

    @GetMapping
    public ResponseEntity<List<Curs>> getAllCursuri(@RequestHeader("Authorization") String auth) {
        String token=securityService.extractToken(auth);
        if((securityService.hasProfesorRole(token) || securityService.hasElevRole(token)) && securityService.isValidToken(token)) {
        List<Curs> cursuri = cursService.getAllCursuri();
        return ResponseEntity.ok(cursuri);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Curs> updateCurs(@RequestHeader("Authorization") String auth,@PathVariable Long id, @RequestBody Curs updatedCurs) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
        Curs curs = cursService.updateCurs(id, updatedCurs);
        return ResponseEntity.ok(curs);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/elev/{elevId}")
    public ResponseEntity<List<Curs>> getCursuriElev(@RequestHeader("Authorization") String auth,@PathVariable Long elevId) {
        String token=securityService.extractToken(auth);
        if((securityService.hasProfesorRole(token) || securityService.hasElevRole(token)) && securityService.isValidToken(token)) {
            List<Curs> cursuriElev = cursService.getCursElev(elevId);
        return ResponseEntity.ok(cursuriElev);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/{cursId}/elevi")
    public ResponseEntity<Void> addEleviLaCurs(@RequestHeader("Authorization") String auth,@PathVariable Long cursId, @RequestBody List<Long> eleviId) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
            cursService.addEleviLaCurs(eleviId, cursId);
        return ResponseEntity.ok().build();
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurs(@RequestHeader("Authorization") String auth,@PathVariable Long id) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
        cursService.deleteCurs(id);
        return ResponseEntity.ok().build();
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/curs/elevi/{id}")
    public ResponseEntity<Set<Elev>> getEleviCurs(@RequestHeader("Authorization") String auth,@PathVariable Long id) {
        String token = securityService.extractToken(auth);
        if (securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
            return ResponseEntity.ok(cursService.getEleviCurs(id));
        } else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }
}
