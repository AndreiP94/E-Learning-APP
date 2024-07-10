package com.example.licenta.repositories;

import com.example.licenta.model.Elev;
import com.example.licenta.model.IncercareQuiz;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface IncercareQuizRepository extends JpaRepository<IncercareQuiz, Long> {
    List<IncercareQuiz> findByElev(Elev elev);
}
