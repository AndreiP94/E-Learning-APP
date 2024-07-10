package com.example.licenta.repositories;

import com.example.licenta.model.Lectie;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface LectieRepository extends JpaRepository<Lectie, Long> {
    List<Lectie> findByCursId(Long cursId);
}
