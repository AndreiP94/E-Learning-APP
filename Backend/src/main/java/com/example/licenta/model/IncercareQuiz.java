package com.example.licenta.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class IncercareQuiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "elev_id")
    private Elev elev;

    private Double scor;

    public IncercareQuiz() {

    }

    public Quiz getQuiz() {
        return quiz;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
    public Double getScor() {
        return scor;
    }

    public void setScor(Double scor) {
        this.scor = scor;
    }

    public IncercareQuiz(Quiz quiz, Elev elev, Double scor) {
        this.quiz = quiz;
        this.elev = elev;
        this.scor = scor;
    }

    public Elev getElev() {
        return elev;
    }

    public void setElev(Elev elev) {
        this.elev = elev;
    }
}
