package com.example.licenta.services;

import com.example.licenta.model.Curs;
import com.example.licenta.model.Lectie;
import com.example.licenta.repositories.CursRepository;
import com.example.licenta.repositories.LectieRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LectieService {
    private final LectieRepository lectieRepository;

    private final CursRepository cursRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(LectieService.class);

    @Autowired
    public LectieService(LectieRepository lectieRepository, CursRepository cursRepository) {
        this.lectieRepository = lectieRepository;
        this.cursRepository = cursRepository;
    }

    public Lectie insertLectie(Lectie lectie) {
        return lectieRepository.save(lectie);
    }

    public Lectie addLectieToCurs(Long cursId, Lectie lectie) {
        Curs curs = cursRepository.findById(cursId).orElseThrow(() -> new RuntimeException("Curs nu a fost găsit."));
        lectie.setCurs(curs);
        return lectieRepository.save(lectie);
    }

    public Lectie getLectieById(Long id) {
        return lectieRepository.findById(id).orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    public List<Lectie> getLectiiByCursId(Long cursId) {
        return lectieRepository.findByCursId(cursId);
    }

    public List<Lectie> getAllLectii() {
        return lectieRepository.findAll();
    }

    public Lectie updateLectie(Long id, Lectie updatedLectie) {
        Lectie lectie = getLectieById(id);
        lectie.setTitlu(updatedLectie.getTitlu());
        lectie.setContinut(updatedLectie.getContinut());
        lectie.setCurs(updatedLectie.getCurs());
        lectie.setSaptamana(updatedLectie.getSaptamana());
        return lectieRepository.save(lectie);
    }

    public void deleteLectie(Long id) {
        lectieRepository.deleteById(id);
    }
}
