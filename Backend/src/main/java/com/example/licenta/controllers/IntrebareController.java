package com.example.licenta.controllers;

import com.example.licenta.model.Intrebare;
import com.example.licenta.services.IntrebareService;
import com.example.licenta.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/intrebari")
public class IntrebareController {

    private final IntrebareService intrebareService;
    private final SecurityService securityService;


    @Autowired
    public IntrebareController(IntrebareService intrebareService, SecurityService securityService) {
        this.intrebareService = intrebareService;
        this.securityService = securityService;
    }

    @PostMapping
    public ResponseEntity<Intrebare> createIntrebare(@RequestBody Intrebare intrebare) {
        Intrebare newIntrebare = intrebareService.insertIntrebare(intrebare);
        return ResponseEntity.ok(newIntrebare);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Intrebare> getIntrebareById(@PathVariable Long id) {
        Intrebare intrebare = intrebareService.getIntrebareById(id);
        return ResponseEntity.ok(intrebare);
    }

    @GetMapping
    public ResponseEntity<List<Intrebare>> getAllIntrebari() {
        List<Intrebare> intrebari = intrebareService.getAllIntrebari();
        return ResponseEntity.ok(intrebari);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Intrebare> updateIntrebare(@RequestHeader("Authorization") String auth,@PathVariable Long id, @RequestBody Intrebare updatedIntrebare) {
        String token=securityService.extractToken(auth);
        if((securityService.hasElevRole(token) || securityService.hasProfesorRole(token)) && securityService.isValidToken(token)) {
        Intrebare intrebare = intrebareService.updateIntrebare(id, updatedIntrebare);
        return ResponseEntity.ok(intrebare);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntrebare(@PathVariable Long id) {
        intrebareService.deleteIntrebare(id);
        return ResponseEntity.ok().build();
    }
}
