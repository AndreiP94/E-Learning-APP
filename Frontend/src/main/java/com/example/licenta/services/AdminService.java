package com.example.licenta.services;

import com.example.licenta.model.Admin;
import com.example.licenta.repositories.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    private final AdminRepository adminRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin insertAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        Admin admin = getAdminById(id);
        admin.setNume(updatedAdmin.getNume());
        admin.setPrenume(updatedAdmin.getPrenume());
        admin.setMail(updatedAdmin.getMail());
        admin.setPoza(updatedAdmin.getPoza());
        admin.setDomiciliu(updatedAdmin.getDomiciliu());
        admin.setVarsta(updatedAdmin.getVarsta());
        return adminRepository.save(admin);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }
}
