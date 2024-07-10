package com.example.licenta.services;

import com.example.licenta.model.Intrebare;
import com.example.licenta.repositories.IntrebareRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class IntrebareService {
    private final IntrebareRepository intrebareRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(IntrebareService.class);

    @Autowired
    public IntrebareService(IntrebareRepository intrebareRepository) {
        this.intrebareRepository = intrebareRepository;
    }

    public Intrebare insertIntrebare(Intrebare intrebare) {
        return intrebareRepository.save(intrebare);
    }

    public Intrebare getIntrebareById(Long id) {
        return intrebareRepository.findById(id).orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public List<Intrebare> getAllIntrebari() {
        return intrebareRepository.findAll();
    }

    public Intrebare updateIntrebare(Long id, Intrebare updatedIntrebare) {
        Intrebare existingIntrebare = intrebareRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Intrebarea cu id-ul " + id + " nu există."));

        existingIntrebare.setText(updatedIntrebare.getText());
        existingIntrebare.setVarianteRaspuns(updatedIntrebare.getVarianteRaspuns());
        existingIntrebare.setVarianteCorecta(updatedIntrebare.getVarianteCorecta());

        return intrebareRepository.save(existingIntrebare);
    }


    public void deleteIntrebare(Long id) {
        intrebareRepository.deleteById(id);
    }
}
