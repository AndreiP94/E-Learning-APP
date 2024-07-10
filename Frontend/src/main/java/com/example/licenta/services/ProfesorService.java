package com.example.licenta.services;

import com.example.licenta.model.Profesor;
import com.example.licenta.model.Utilizator;
import com.example.licenta.repositories.ProfesorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfesorService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ProfesorService.class);

    private final ProfesorRepository profesorRepository;

    private final UserService userService;

    @Autowired
    public ProfesorService(ProfesorRepository profesorRepository, UserService userService) {
        this.profesorRepository = profesorRepository;
        this.userService = userService;
    }

    public Profesor insertProfesor(Profesor profesor) {
        Utilizator utilizator = new Utilizator();
        utilizator.setUsername(profesor.getMail());
        utilizator.setParola(userService.generateRandomPassword());
        utilizator.setRol("profesor");
        userService.insertUser(utilizator);
        profesor.setUtilizator(utilizator);
        userService.sendEmailParolaGenerata(profesor.getMail(), utilizator.getParola());
        return profesorRepository.save(profesor);
    }

    public Profesor getProfesorById(Long id) {
        return profesorRepository.findById(id).orElseThrow(() -> new RuntimeException("Professor not found"));

    }

    public Profesor getProfesorByMail(String email){
        Optional<Profesor> profesorOptional=profesorRepository.findProfesorByMail(email);
        Profesor profesor=profesorOptional.get();
        return profesor;
    }

    public List<Profesor> getAllProfesori() {
        return profesorRepository.findAll();
    }

    public Profesor updateProfesor(Long id, Profesor updatedProfesor) {
        Profesor profesor = profesorRepository.findById(id).orElseThrow(() -> new RuntimeException("Professor not found"));
        profesor.setNume(updatedProfesor.getNume());
        profesor.setPrenume(updatedProfesor.getPrenume());
        profesor.setMail(updatedProfesor.getMail());
        profesor.setMaterie(updatedProfesor.getMaterie());
        profesor.setDomiciuliu(updatedProfesor.getDomiciuliu());
        profesor.setVarsta(updatedProfesor.getVarsta());
        profesor.setPozaProfil(updatedProfesor.getPozaProfil());
        return profesorRepository.save(profesor);
    }

    public void deleteProfesor(Long id) {
        profesorRepository.deleteById(id);
    }

    public Profesor updatePhoto(Long id, String profilePhoto){
        Optional<Profesor> profesor=profesorRepository.findById(id);
        Profesor profesorToUpdate =profesor.get();
        profesorToUpdate.setPozaProfil(profilePhoto);
        return profesorRepository.save(profesorToUpdate);
    }

}
