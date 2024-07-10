package com.example.licenta.model;

import com.example.licenta.model.Utilizator;
import com.sun.istack.NotNull;

import javax.persistence.*;
import javax.validation.constraints.Email;

@Entity
public class Admin{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String nume;
    @NotNull
    private String prenume;
    @Email
    private String mail;

    private String domiciliu;
    private String poza;
    private Integer varsta;

    @OneToOne
    @JoinColumn(name = "utilizator_id", referencedColumnName = "id")
    private Utilizator utilizator;

    public Admin(String nume, String prenume, String mail, String domiciliu, String poza, Integer varsta, Utilizator utilizator) {
        this.nume = nume;
        this.prenume = prenume;
        this.mail = mail;
        this.domiciliu = domiciliu;
        this.poza = poza;
        this.varsta = varsta;
        this.utilizator = utilizator;
    }

    public String getDomiciliu() {
        return domiciliu;
    }

    public void setDomiciliu(String domiciliu) {
        this.domiciliu = domiciliu;
    }

    public String getPoza() {
        return poza;
    }

    public void setPoza(String poza) {
        this.poza = poza;
    }

    public Integer getVarsta() {
        return varsta;
    }

    public void setVarsta(Integer varsta) {
        this.varsta = varsta;
    }

    public Utilizator getUtilizator() {
        return utilizator;
    }

    public void setUtilizator(Utilizator utilizator) {
        this.utilizator = utilizator;
    }

    public Admin() {

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
}
