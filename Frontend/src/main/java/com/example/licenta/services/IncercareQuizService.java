package com.example.licenta.services;

import com.example.licenta.model.*;
import com.example.licenta.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IncercareQuizService {
    private final IncercareQuizRepository incercareQuizRepository;

    private final IntrebareRepository intrebareRepository;


    private final QuizRepository quizRepository;
    private final ElevRepository elevRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(IncercareQuizService.class);

    @Autowired
    public IncercareQuizService(IncercareQuizRepository incercareQuizRepository, IntrebareRepository intrebareRepository, QuizRepository quizRepository, ElevRepository elevRepository) {
        this.incercareQuizRepository = incercareQuizRepository;
        this.intrebareRepository = intrebareRepository;
        this.quizRepository = quizRepository;
        this.elevRepository = elevRepository;
    }
    public IncercareQuiz createQuizAttempt(Long quizId,String emailElev) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        Optional<Elev> elev = elevRepository.findElevByMail(emailElev);
        IncercareQuiz incercareQuiz = new IncercareQuiz(quiz, elev.get(), 0.0);
        incercareQuiz = incercareQuizRepository.save(incercareQuiz);
        return incercareQuiz;
    }

    public List<Intrebare> getRandomQuestions(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        List<Intrebare> questions = quiz.getIntrebari();
        int numQuestions=quiz.getNumarIntrebariQuiz();
        Collections.shuffle(questions);
        return questions.stream().limit(numQuestions).collect(Collectors.toList());
    }

    public void updateQuizAttemptScore(Long incercareQuizId, Double score) {
        IncercareQuiz incercareQuiz = incercareQuizRepository.findById(incercareQuizId)
                .orElseThrow(() -> new RuntimeException("Quiz Attempt not found"));
        incercareQuiz.setScor(score);
        incercareQuizRepository.save(incercareQuiz);
    }

    public List<IncercareQuiz> getAllIncercari(){
        return incercareQuizRepository.findAll();
    }

    public List<IncercareQuiz> getAllIncercariStudent(String email){
        Optional<Elev> elev=elevRepository.findElevByMail(email);
        List<IncercareQuiz> incercareQuiz=incercareQuizRepository.findByElev(elev.get());
        return incercareQuiz;
    }


}
