package com.example.licenta.services;

import com.example.licenta.model.Elev;
import com.example.licenta.model.Profesor;
import com.example.licenta.model.Utilizator;
import com.example.licenta.repositories.ElevRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ElevService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ElevService.class);

    private final ElevRepository elevRepository;

    private final UserService userService;

    @Autowired
    public ElevService(ElevRepository elevRepository, UserService userService) {
        this.elevRepository = elevRepository;
        this.userService = userService;
    }

    public Elev insertElev(Elev elev) {
        Utilizator utilizator = new Utilizator();
        utilizator.setUsername(elev.getMail());
        utilizator.setParola(userService.generateRandomPassword());
        utilizator.setRol("elev");
        userService.insertUser(utilizator);
        elev.setUtilizator(utilizator);
        elev.setUtilizator(utilizator);
        userService.sendEmailParolaGenerata(elev.getMail(),utilizator.getParola());
        return elevRepository.save(elev);
    }

    public Elev getElevById(Long id) {
        return elevRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public List<Elev> getAllElevi() {
        return elevRepository.findAll();
    }

    public Elev updateElev(Long id, Elev updatedElev) {
        Elev elev = elevRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found"));
    elev.setNume(updatedElev.getNume());
    elev.setPrenume(updatedElev.getPrenume());
    elev.setMail(updatedElev.getMail());
    elev.setClasa(updatedElev.getClasa());
    elev.setDomiciu(updatedElev.getDomiciu());
    elev.setPozaProfil(updatedElev.getPozaProfil());
    elev.setVarsta(updatedElev.getVarsta());
        return elevRepository.save(elev);
    }

    public void deleteElev(Long id) {
        elevRepository.deleteById(id);
    }

    public Elev getElevByEmail(String email){
        Optional<Elev> elev=elevRepository.findElevByMail(email);
        Elev elev1=elev.get();
        return elev1;
    }

    public Elev updatePhoto(Long id, String profilePhoto){
        Optional<Elev> elev=elevRepository.findById(id);
        Elev elevToUpdate =elev.get();
        elevToUpdate.setPozaProfil(profilePhoto);
        return elevRepository.save(elevToUpdate);
    }
}
