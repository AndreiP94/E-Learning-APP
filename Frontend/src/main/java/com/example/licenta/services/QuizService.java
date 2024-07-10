package com.example.licenta.services;

import com.example.licenta.model.*;
import com.example.licenta.repositories.CursRepository;
import com.example.licenta.repositories.IntrebareRepository;
//import com.example.licenta.repositories.OptiuneRaspunsRepository;
import com.example.licenta.repositories.QuizRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuizService {
    private final QuizRepository quizRepository;

    private final CursRepository cursRepository;

    private final IntrebareRepository intrebareRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(QuizService.class);

    @Autowired
    public QuizService(QuizRepository quizRepository, CursRepository cursRepository, IntrebareRepository intrebareRepository) {
        this.quizRepository = quizRepository;
        this.cursRepository = cursRepository;
        this.intrebareRepository = intrebareRepository;
    }

    public Quiz insertQuiz(Long cursId, Quiz quiz, List<Intrebare> intrebari) {
        Optional<Curs> optionalCurs = cursRepository.findById(cursId);
        if (optionalCurs.isPresent()) {
            quiz.setCurs(optionalCurs.get());
            if (quiz.getIntrebari() == null) {
                quiz.setIntrebari(new ArrayList<>());
            }
            for (Intrebare intrebare : intrebari) {
                Intrebare savedIntrebare = intrebareRepository.save(intrebare);
                savedIntrebare.setVarianteRaspuns(intrebare.getVarianteRaspuns());
                savedIntrebare.setVarianteCorecta(intrebare.getVarianteCorecta());
                quiz.getIntrebari().add(savedIntrebare);
            }
            return quizRepository.save(quiz);
        } else {
            throw new EntityNotFoundException("Cursul cu id-ul " + cursId + " nu a fost găsit.");
        }
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
    }


    public List<Quiz> findQuizzesForElev(Long elevId) {
        List<Curs> cursuri = cursRepository.findByEleviId(elevId);

        List<Quiz> quizzes = cursuri.stream()
                .flatMap(curs -> quizRepository.findByCursId(curs.getId()).stream())
                .collect(Collectors.toList());

        return quizzes;
    }


    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Quiz updateQuiz(Long id, Quiz updatedQuiz) {
        Quiz quiz = getQuizById(id);
        quiz.setTitlu(updatedQuiz.getTitlu());
        quiz.setStart(updatedQuiz.getStart());
        quiz.setStop(updatedQuiz.getStop());
        quiz.setSaptamanaQuiz(updatedQuiz.getSaptamanaQuiz());
        quiz.setNumarIntrebariQuiz(updatedQuiz.getNumarIntrebariQuiz());
        quiz.setPunctajPeIntrebare(updatedQuiz.getNumarIntrebariQuiz());
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

    public List<Quiz> getQuizByCursId(Long cursId) {
        return quizRepository.findByCursId(cursId);
    }
}
