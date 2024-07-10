package com.example.licenta.model;

import com.example.licenta.model.Curs;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titlu;

    @ManyToOne
    @JoinColumn(name = "curs_id")
    @JsonIgnoreProperties("quizuri")
    private Curs curs;


    private LocalDateTime start;

    private LocalDateTime stop;

    private Integer saptamanaQuiz;

    @OneToMany(cascade = CascadeType.REMOVE)
    private List<Intrebare> intrebari;

    private Integer numarIntrebariQuiz;

    private Integer punctajPeIntrebare;

    public Quiz() {

    }

    public Quiz(String titlu, Curs curs, LocalDateTime start, LocalDateTime stop, Integer saptamanaQuiz, List<Intrebare> intrebari, Integer numarIntrebariQuiz, Integer punctajPeIntrebare) {
        this.titlu = titlu;
        this.curs = curs;
        this.start = start;
        this.stop = stop;
        this.saptamanaQuiz = saptamanaQuiz;
        this.intrebari = intrebari;
        this.numarIntrebariQuiz = numarIntrebariQuiz;
        this.punctajPeIntrebare = punctajPeIntrebare;
    }

    public Integer getSaptamanaQuiz() {
        return saptamanaQuiz;
    }

    public Integer getPunctajPeIntrebare() {
        return punctajPeIntrebare;
    }

    public void setPunctajPeIntrebare(Integer punctajPeIntrebare) {
        this.punctajPeIntrebare = punctajPeIntrebare;
    }

    public Integer getNumarIntrebariQuiz() {
        return numarIntrebariQuiz;
    }

    public void setNumarIntrebariQuiz(Integer numarIntrebariQuiz) {
        this.numarIntrebariQuiz = numarIntrebariQuiz;
    }

    public void setSaptamanaQuiz(Integer saptamana) {
        this.saptamanaQuiz = saptamana;
    }

    public List<Intrebare> getIntrebari() {
        return intrebari;
    }

    public void setIntrebari(List<Intrebare> intrebari) {
        this.intrebari = intrebari;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitlu() {
        return titlu;
    }

    public void setTitlu(String titlu) {
        this.titlu = titlu;
    }

    public Curs getCurs() {
        return curs;
    }

    public void setCurs(Curs curs) {
        this.curs = curs;
    }

    public LocalDateTime getStart() {
        return start;
    }

    public void setStart(LocalDateTime start) {
        this.start = start;
    }

    public LocalDateTime getStop() {
        return stop;
    }

    public void setStop(LocalDateTime stop) {
        this.stop = stop;
    }
}
