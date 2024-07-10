package com.example.licenta.model;

import com.example.licenta.model.Utilizator;

import javax.persistence.*;
import javax.validation.constraints.Email;

@Entity
public class Profesor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nume;
    private String prenume;
    @Email
    @Column(unique = true)
    private String mail;
    private String materie;
    private String domiciuliu;
    private String varsta;
    private String pozaProfil;

    @OneToOne
    @JoinColumn(name = "utilizator_id", referencedColumnName = "id")
    private Utilizator utilizator;

    public Profesor(String nume, String prenume, String mail, String materie, String domiciuliu, String varsta, String pozaProfil, Utilizator utilizator) {
        this.nume = nume;
        this.prenume = prenume;
        this.mail = mail;
        this.materie = materie;
        this.domiciuliu = domiciuliu;
        this.varsta = varsta;
        this.pozaProfil = pozaProfil;
        this.utilizator = utilizator;
    }

    public String getDomiciuliu() {
        return domiciuliu;
    }

    public void setDomiciuliu(String domiciuliu) {
        this.domiciuliu = domiciuliu;
    }

    public String getVarsta() {
        return varsta;
    }

    public void setVarsta(String varsta) {
        this.varsta = varsta;
    }

    public String getPozaProfil() {
        return pozaProfil;
    }

    public void setPozaProfil(String pozaProfil) {
        this.pozaProfil = pozaProfil;
    }

    public Profesor() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getMaterie() {
        return materie;
    }

    public void setMaterie(String materie) {
        this.materie = materie;
    }

    public Utilizator getUtilizator() {
        return utilizator;
    }

    public void setUtilizator(Utilizator utilizator) {
        this.utilizator = utilizator;
    }
}
