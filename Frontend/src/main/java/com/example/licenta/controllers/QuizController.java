package com.example.licenta.controllers;

import com.example.licenta.model.Curs;
import com.example.licenta.model.Intrebare;
import com.example.licenta.model.Lectie;
import com.example.licenta.model.Quiz;
import com.example.licenta.services.IntrebareService;
import com.example.licenta.services.QuizService;
import com.example.licenta.services.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;
    private final SecurityService securityService;



    @Autowired
    public QuizController(QuizService quizService, SecurityService securityService) {
        this.quizService = quizService;
        this.securityService = securityService;
    }

    @GetMapping
    public ResponseEntity<List<Quiz>> getAllQuizzes() {
        List<Quiz> quizuri= quizService.getAllQuizzes();
        return ResponseEntity.ok(quizuri);
    }

    @GetMapping("/quizzCurs/{cursId}")
    public ResponseEntity<List<Quiz>> getQuizByCursId(@RequestHeader("Authorization") String auth,@PathVariable Long cursId) {
        String token=securityService.extractToken(auth);
        if((securityService.hasProfesorRole(token) || securityService.hasElevRole(token)) && securityService.isValidToken(token)) {
            List<Quiz> quizzes = quizService.getQuizByCursId(cursId);
            return ResponseEntity.ok(quizzes);
        }
         else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PostMapping("/{cursId}")
    public ResponseEntity<Quiz> createQuiz(@PathVariable Long cursId, @RequestBody QuizCreationRequest request) {
        Quiz newQuiz = quizService.insertQuiz(cursId, request.getQuiz(), request.getIntrebari());
        return ResponseEntity.ok(newQuiz);
    }



    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@RequestHeader("Authorization") String auth,@PathVariable Long id) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
            Quiz quiz = quizService.getQuizById(id);
            return ResponseEntity.ok(quiz);
        }else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @GetMapping("/elev/{elevId}")
    public ResponseEntity<List<Quiz>> findQuizzesForElev(@PathVariable Long elevId) {
        List<Quiz> quizzes = quizService.findQuizzesForElev(elevId);
        return ResponseEntity.ok(quizzes);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Quiz> updateQuiz(@RequestHeader("Authorization") String auth,@PathVariable Long id, @RequestBody Quiz updatedQuiz) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
            Quiz quiz = quizService.updateQuiz(id, updatedQuiz);
            return ResponseEntity.ok(quiz);
        }
         else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@RequestHeader("Authorization") String auth,@PathVariable Long id) {
        String token=securityService.extractToken(auth);
        if(securityService.hasProfesorRole(token) && securityService.isValidToken(token)) {
            quizService.deleteQuiz(id);
            return ResponseEntity.ok().build();
        }
        else
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    static class QuizCreationRequest {
        private Quiz quiz;
        private List<Intrebare> intrebari;

        public Quiz getQuiz() {
            return quiz;
        }

        public void setQuiz(Quiz quiz) {
            this.quiz = quiz;
        }

        public List<Intrebare> getIntrebari() {
            return intrebari;
        }

        public void setIntrebari(List<Intrebare> intrebari) {
            this.intrebari = intrebari;
        }
    }
}
