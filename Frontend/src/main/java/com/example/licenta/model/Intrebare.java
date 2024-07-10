package com.example.licenta.model;

import com.example.licenta.model.Quiz;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.licenta.config.StringListConverter;

import javax.persistence.*;
import java.io.IOException;
import java.util.List;

@Entity
public class Intrebare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;

    @Convert(converter = StringListConverter.class)
    private List<String> varianteRaspuns;

    private String varianteCorecta;


    public Intrebare(String text) {
        this.text = text;
    }

    public Intrebare() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getVarianteRaspuns() {
        return varianteRaspuns;
    }

    public void setVarianteRaspuns(List<String> varianteRaspuns) {
        this.varianteRaspuns = varianteRaspuns;
    }

    public String getVarianteCorecta() {
        return varianteCorecta;
    }

    public void setVarianteCorecta(String varianteCorecta) {
        this.varianteCorecta = varianteCorecta;
    }
}
