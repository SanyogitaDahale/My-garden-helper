package com.garden.garden_helper.entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer rating;

    private String comment;

    @ManyToOne
    @JsonIgnoreProperties({
    "appointments",
    "hibernateLazyInitializer",
    "handler"
    })
    private User customer;

    @ManyToOne
    @JsonIgnoreProperties({
    "appointments",
    "hibernateLazyInitializer",
    "handler"
    })
    private User gardener;

    @ManyToOne
    @JoinColumn(name="appointment_id")
    private Appointment appointment;

    // GETTERS

    public Long getId() {
        return id;
    }

    public Integer getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public User getCustomer() {
        return customer;
    }

    public User getGardener() {
        return gardener;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    // SETTERS

    public void setId(Long id) {
        this.id=id;
    }

    public void setRating(Integer rating) {
        this.rating=rating;
    }

    public void setComment(String comment) {
        this.comment=comment;
    }

    public void setCustomer(User customer) {
        this.customer=customer;
    }

    public void setGardener(User gardener) {
        this.gardener=gardener;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment=appointment;
    }
}