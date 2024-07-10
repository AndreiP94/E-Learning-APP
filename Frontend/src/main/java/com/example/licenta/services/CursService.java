package com.example.licenta.services;

import com.example.licenta.config.EmailSender;
import com.example.licenta.model.Curs;
import com.example.licenta.model.Elev;
import com.example.licenta.repositories.CursRepository;
import com.example.licenta.repositories.ElevRepository;
//import org.opencv.core.Core;
//import org.opencv.core.CvType;
//import org.opencv.core.Mat;
//import org.opencv.ml.SVM;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.transaction.Transactional;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CursService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CursService.class);

    private final CursRepository cursRepository;

    private final ElevRepository elevRepository;


    @Autowired
    public CursService(CursRepository cursRepository, ElevRepository elevRepository) {
        this.cursRepository = cursRepository;
        this.elevRepository = elevRepository;

    }

    public Curs insertCurs(Curs curs) {
        return cursRepository.save(curs);
    }

    public Curs getCursById(Long id) {
        return cursRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public List<Curs> getAllCursuri() {
        return cursRepository.findAll();
    }

    public Curs updateCurs(Long id, Curs updatedCurs) {
        Curs curs = cursRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));
        curs.setTitlu(updatedCurs.getTitlu());
        curs.setProfesor(updatedCurs.getProfesor());
        curs.setPoza(updatedCurs.getPoza());
        curs.setSaptamani(updatedCurs.getSaptamani());
        return cursRepository.save(curs);
    }

    public List<Curs> getCursElev(Long idElev) {
        List<Curs> cursuri = cursRepository.findAll();
        List<Curs> cursuriElev = cursuri.stream()
                .filter(curs -> curs.getElevi().stream()
                        .anyMatch(elev -> elev.getId().equals(idElev)))
                .collect(Collectors.toList());
        return cursuriElev;
    }


    @Transactional
    public void addEleviLaCurs(List<Long> eleviId, Long cursId) {
        Curs curs = cursRepository.findById(cursId).orElseThrow(() -> new RuntimeException("Curs nu a fost găsit."));
        for (Long elevId : eleviId) {
            Elev elev = elevRepository.findById(elevId).orElseThrow(() -> new RuntimeException("Elev nu a fost găsit cu ID-ul: " + elevId));
            curs.getElevi().add(elev);
            elev.getCursuriInscris().add(curs);
        }
        cursRepository.save(curs);
    }

    public void deleteCurs(Long id) {
        cursRepository.deleteById(id);
    }

    public Set<Elev> getEleviCurs(Long id){
        Optional<Curs> curs=cursRepository.findById(id);
        return curs.get().getElevi();
    }
}
