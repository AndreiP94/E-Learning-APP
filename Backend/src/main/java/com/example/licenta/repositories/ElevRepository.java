package com.example.licenta.repositories;

import com.example.licenta.model.Elev;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ElevRepository extends JpaRepository<Elev, Long> {
    Optional<Elev> findElevByMail(String email);
}
