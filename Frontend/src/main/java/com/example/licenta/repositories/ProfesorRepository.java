package com.example.licenta.repositories;

import com.example.licenta.model.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfesorRepository extends JpaRepository<Profesor, Long> {
    Optional<Profesor> findProfesorByMail(String mail);
}
