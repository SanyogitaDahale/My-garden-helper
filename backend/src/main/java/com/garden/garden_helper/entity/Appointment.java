package com.garden.garden_helper.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "appointment")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // CUSTOMER DETAILS
    // =========================

    private String customerName;

    private String phone;

    private String address;

    // =========================
    // SERVICES
    // =========================

    @ElementCollection
    @CollectionTable(
        name = "appointment_services",
        joinColumns = @JoinColumn(name = "appointment_id")
    )
    @Column(name = "service_name")
    private List<String> serviceNames;

    // =========================
    // DATE & TIME
    // =========================

    private String bookingDate;

    private String bookingTime;

    private LocalDateTime appointmentDate;

    // =========================
    // STATUS
    // =========================

    @Column(nullable = false)
    private String status = "PENDING";

    // =========================
    // RELATIONSHIPS
    // =========================

    // Customer who created booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private User customer;

    // Gardener assigned by admin
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gardener_id")
    private User gardener;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public List<String> getServiceNames() {
        return serviceNames;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public String getBookingTime() {
        return bookingTime;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public String getStatus() {
        return status;
    }

    public User getCustomer() {
        return customer;
    }

    public User getGardener() {
        return gardener;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setServiceNames(List<String> serviceNames) {
        this.serviceNames = serviceNames;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public void setBookingTime(String bookingTime) {
        this.bookingTime = bookingTime;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public void setGardener(User gardener) {
        this.gardener = gardener;
    }
}