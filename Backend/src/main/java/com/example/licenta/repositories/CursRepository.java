package com.example.licenta.repositories;

import com.example.licenta.model.Curs;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CursRepository extends JpaRepository<Curs, Long> {
    List<Curs> findByEleviId(Long elevId);
}
