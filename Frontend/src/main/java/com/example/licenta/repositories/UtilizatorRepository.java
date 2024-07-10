package com.example.licenta.repositories;

import com.example.licenta.model.Utilizator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilizatorRepository extends JpaRepository<Utilizator, Long> {
    Utilizator findByUsername(String username);
}
