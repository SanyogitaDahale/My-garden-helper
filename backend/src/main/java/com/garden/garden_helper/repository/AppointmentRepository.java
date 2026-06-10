package com.garden.garden_helper.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.garden.garden_helper.entity.Appointment;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {


    List<Appointment> findByCustomerId(Long customerId);

    List<Appointment> findByGardenerId(Long gardenerId);


    List<Appointment> findByGardenerIdAndStatus(
            Long gardenerId,
            String status
    );


    long countByStatus(String status);
}