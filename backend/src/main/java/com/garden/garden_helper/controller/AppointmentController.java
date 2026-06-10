package com.garden.garden_helper.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.garden.garden_helper.dto.AppointmentRequest;
import com.garden.garden_helper.entity.Appointment;
import com.garden.garden_helper.entity.User;
import com.garden.garden_helper.repository.AppointmentRepository;
import com.garden.garden_helper.repository.UserRepository;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    // =========================================
    // BOOK APPOINTMENT
    // =========================================

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(
            @RequestBody AppointmentRequest request) {

        User user = userRepository
                .findById(request.getUserId())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        // CREATE APPOINTMENT
        Appointment appointment = new Appointment();

        // MULTIPLE SERVICES
        appointment.setServiceNames(
                request.getServiceNames()
        );

        appointment.setAppointmentDate(
                request.getAppointmentDate()
        );

        appointment.setStatus("PENDING");

        // CUSTOMER
        appointment.setCustomer(user);

        // CUSTOMER DETAILS
        appointment.setCustomerName(user.getName());

        appointment.setAddress(
                request.getAddress()
        );

        appointment.setPhone(
                request.getPhone()
        );

        // OPTIONAL DATE/TIME
        appointment.setBookingDate(
                request.getBookingDate()
        );

        appointment.setBookingTime(
                request.getBookingTime()
        );

        // SAVE
        appointmentRepository.save(appointment);

        return ResponseEntity.ok(
                "Booking Successful"
        );
    }

    // =========================================
    // CUSTOMER APPOINTMENTS
    // =========================================

    @GetMapping("/customer/{customerId}")
    public List<Appointment> getCustomerAppointments(
            @PathVariable Long customerId) {

        return appointmentRepository
                .findByCustomerId(customerId);
    }

    // =========================================
    // GARDENER APPOINTMENTS
    // =========================================

    @GetMapping("/gardener/{gardenerId}")
    public List<Appointment> getGardenerAppointments(
            @PathVariable Long gardenerId) {

        return appointmentRepository
                .findByGardenerId(gardenerId);
    }

    // =========================================
    // UPDATE STATUS
    // =========================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElse(null);

        if (appointment == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Appointment not found");
        }

        appointment.setStatus(status);

        appointmentRepository.save(appointment);

        return ResponseEntity.ok(
                "Status updated"
        );
    }

    // =========================================
    // ASSIGN GARDENER
    // =========================================

    @PutMapping("/{id}/assign/{gardenerId}")
    public ResponseEntity<?> assignGardener(
            @PathVariable Long id,
            @PathVariable Long gardenerId) {

        Appointment appointment =
                appointmentRepository
                        .findById(id)
                        .orElse(null);

        User gardener =
                userRepository
                        .findById(gardenerId)
                        .orElse(null);

        if (appointment == null || gardener == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid data");
        }

        appointment.setGardener(gardener);

        appointmentRepository.save(appointment);

        return ResponseEntity.ok(
                "Gardener assigned"
        );
        
    }
 // =========================================
 // ALL APPOINTMENTS (ADMIN)
 // =========================================

 @GetMapping("/all")
 public List<Appointment> getAllAppointments() {

     return appointmentRepository.findAll();

 }
}