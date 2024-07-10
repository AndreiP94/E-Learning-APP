package com.example.licenta.controllers;

import com.example.licenta.model.IncercareQuiz;
import com.example.licenta.model.Intrebare;
import com.example.licenta.services.IncercareQuizService;
import com.example.licenta.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/incercari-quiz")

public class IncercareQuizController {

    private final IncercareQuizService incercareQuizService;
    private final SecurityService securityService;


    @Autowired
    public IncercareQuizController(IncercareQuizService incercareQuizService, SecurityService securityService) {
        this.incercareQuizService = incercareQuizService;
        this.securityService = securityService;
    }

    @PostMapping("/createAttempt/{id_quiz}/{email_elev}")
    public ResponseEntity<?> createIncercare(@RequestHeader("Authorization") String auth,@PathVariable Long id_quiz, @PathVariable String email_elev){
        String token=securityService.extractToken(auth);
        if(securityService.hasElevRole(token) && securityService.isValidToken(token)) {
            IncercareQuiz incercareQuiz=incercareQuizService.createQuizAttempt(id_quiz,email_elev);
        return ResponseEntity.ok(incercareQuiz);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("/updateScor/{id_incercare}/{scor}")
    public ResponseEntity<?> updateScor(@RequestHeader("Authorization") String auth,@PathVariable Long id_incercare,@PathVariable Double scor){
        String token=securityService.extractToken(auth);
        if(securityService.hasElevRole(token) && securityService.isValidToken(token)) {
            incercareQuizService.updateQuizAttemptScore(id_incercare, scor);
        return ResponseEntity.ok().build();
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/getIncercari")
    public ResponseEntity<List<IncercareQuiz>> getIncercari(){
        List<IncercareQuiz> incercari=incercareQuizService.getAllIncercari();
        return ResponseEntity.ok(incercari);
    }

    @GetMapping("/getIncercariElev/{email}")
    public ResponseEntity<List<IncercareQuiz>> getIncercari(@RequestHeader("Authorization") String auth,@PathVariable String email){
        String token=securityService.extractToken(auth);
        if((securityService.hasProfesorRole(token) || securityService.hasElevRole(token)) && securityService.isValidToken(token)) {
        List<IncercareQuiz> incercari=incercareQuizService.getAllIncercariStudent(email);
        return ResponseEntity.ok(incercari);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);

    }


    @GetMapping("/getRandomQuestions/{id_quiz}")
    public ResponseEntity<List<Intrebare>> getRandomQuestions(@RequestHeader("Authorization") String auth,@PathVariable Long id_quiz) {
        String token=securityService.extractToken(auth);
        if((securityService.hasProfesorRole(token) || securityService.hasElevRole(token)) && securityService.isValidToken(token)) {

            List<Intrebare> intrebari=incercareQuizService.getRandomQuestions(id_quiz);
        return ResponseEntity.ok(intrebari);
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }



}
