package com.example.licenta.repositories;

import com.example.licenta.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCursId(Long id);
}
