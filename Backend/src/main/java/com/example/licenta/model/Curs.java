package com.example.licenta.model;

import com.example.licenta.model.Profesor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Entity
public class Curs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titlu;
    private String poza;
    @ManyToOne
    private Profesor profesor;
    @JsonIgnore
    @ManyToMany(mappedBy = "cursuriInscris", fetch = FetchType.EAGER)
    private Set<Elev> elevi = new HashSet<>();


    private Integer saptamani;
    public Integer getSaptamani() {
        return saptamani;
    }
    public void setSaptamani(Integer saptamani) {
        this.saptamani = saptamani;
    }

    public String getPoza() {
        return poza;
    }

    public void setPoza(String poza) {
        this.poza = poza;
    }

    public Curs(String titlu, String poza, Profesor profesor, Set<Elev> elevi,Integer saptamani) {
        this.titlu = titlu;
        this.poza = poza;
        this.profesor = profesor;
        this.elevi = elevi;
        this.saptamani=saptamani;
    }

    public Curs() {

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

    public Profesor getProfesor() {
        return profesor;
    }

    public void setProfesor(Profesor profesor) {
        this.profesor = profesor;
    }

    public Set<Elev> getElevi() {
        return elevi;
    }

    public void setElevi(Set<Elev> elevi) {
        this.elevi = elevi;
    }
}
