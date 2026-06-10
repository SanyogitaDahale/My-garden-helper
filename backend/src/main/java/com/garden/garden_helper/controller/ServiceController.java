package com.garden.garden_helper.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.garden.garden_helper.entity.Service;
import com.garden.garden_helper.repository.ServiceRepository;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/services")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @PostMapping
    public Service addService(@RequestBody Service service) {
        return serviceRepository.save(service);
    }

    @GetMapping
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }

    @PutMapping("/{id}")
    public Service updateService(@PathVariable Long id, @RequestBody Service updatedService) {
        Service service = serviceRepository.findById(id).orElseThrow();

        service.setName(updatedService.getName());
        service.setDescription(updatedService.getDescription());
        service.setPrice(updatedService.getPrice());

        return serviceRepository.save(service);
    }

    @DeleteMapping("/{id}")
    public String deleteService(@PathVariable Long id) {
        serviceRepository.deleteById(id);
        return "Service deleted successfully";
    }
}