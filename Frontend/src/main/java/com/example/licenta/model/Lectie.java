package com.example.licenta.model;

import com.example.licenta.model.Curs;

import javax.persistence.*;

@Entity
public class Lectie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titlu;
    private String continut;

    private Integer saptamana;

    @ManyToOne
    private Curs curs;

    public Lectie(String titlu, String continut, Curs curs,Integer saptamana) {
        this.titlu = titlu;
        this.continut = continut;
        this.curs = curs;
        this.saptamana=saptamana;
    }

    public Lectie() {

    }

    public Integer getSaptamana() {
        return saptamana;
    }

    public void setSaptamana(Integer saptamana) {
        this.saptamana = saptamana;
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

    public String getContinut() {
        return continut;
    }

    public void setContinut(String continut) {
        this.continut = continut;
    }

    public Curs getCurs() {
        return curs;
    }

    public void setCurs(Curs curs) {
        this.curs = curs;
    }
}
