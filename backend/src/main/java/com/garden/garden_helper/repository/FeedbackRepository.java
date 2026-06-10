package com.garden.garden_helper.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.garden.garden_helper.entity.Feedback;

public interface FeedbackRepository
extends JpaRepository<Feedback,Long>{

    List<Feedback>
    findByGardenerId(Long gardenerId);

}