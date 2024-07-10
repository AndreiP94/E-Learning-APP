package com.example.licenta.model;

import com.example.licenta.model.Utilizator;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import javax.validation.constraints.Email;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Elev{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nume;

    private String prenume;

    @Email
    @Column(unique = true)
    private String mail;
    private String clasa;
    private String domiciu;
    private String pozaProfil;
    private Integer varsta;

    public Elev(String nume, String prenume, String mail, String clasa) {
        this.nume=nume;
        this.prenume=prenume;
        this.mail=mail;
        this.clasa=clasa;
    }

    public String getDomiciu() {
        return domiciu;
    }

    public void setDomiciu(String domiciu) {
        this.domiciu = domiciu;
    }

    public String getPozaProfil() {
        return pozaProfil;
    }

    public void setPozaProfil(String pozaProfil) {
        this.pozaProfil = pozaProfil;
    }

    public Integer getVarsta() {
        return varsta;
    }

    public void setVarsta(Integer varsta) {
        this.varsta = varsta;
    }

    @OneToOne
    @JoinColumn(name = "utilizator_id", referencedColumnName = "id")
    private Utilizator utilizator;

    public Utilizator getUtilizator() {
        return utilizator;
    }

    public void setUtilizator(Utilizator utilizator) {
        this.utilizator = utilizator;
    }

    public Set<Curs> getCursuriInscris() {
        return cursuriInscris;
    }

    public void setCursuriInscris(Set<Curs> cursuriInscris) {
        this.cursuriInscris = cursuriInscris;
    }
    @ManyToMany
    @JoinTable(
            name = "elev_curs",
            joinColumns = @JoinColumn(name = "elev_id"),
            inverseJoinColumns = @JoinColumn(name = "curs_id"))
    private Set<Curs> cursuriInscris = new HashSet<>();

    public Elev(String nume, String prenume, String mail, String clasa, String domiciu, String pozaProfil, Integer varsta, Utilizator utilizator, Set<Curs> cursuriInscris) {
        this.nume = nume;
        this.prenume = prenume;
        this.mail = mail;
        this.clasa = clasa;
        this.domiciu = domiciu;
        this.pozaProfil = pozaProfil;
        this.varsta = varsta;
        this.utilizator = utilizator;
        this.cursuriInscris = cursuriInscris;
    }

    public Elev() {

    }

    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public String getPrenume() {
        return prenume;
    }

    public void setPrenume(String prenume) {
        this.prenume = prenume;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getClasa() {
        return clasa;
    }

    public void setClasa(String clasa) {
        this.clasa = clasa;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
