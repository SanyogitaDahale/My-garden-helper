package com.garden.garden_helper.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.garden.garden_helper.entity.Feedback;
import com.garden.garden_helper.repository.FeedbackRepository;

@RestController
@RequestMapping("/feedback")
@CrossOrigin(origins="*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping
    public ResponseEntity<?> saveFeedback(

    @RequestBody Feedback feedback

    ){

    try{

    Feedback saved =
    feedbackRepository.save(
    feedback
    );

    return ResponseEntity.ok(
    saved
    );

    }
    catch(Exception e){

    e.printStackTrace();

    return ResponseEntity
    .badRequest()
    .body(
    e.getMessage()
    );

    }

    }

    @GetMapping("/gardener/{id}")
    public List<Feedback>
    getGardenerFeedback(

            @PathVariable Long id
    ){

        return feedbackRepository
                .findByGardenerId(id);

    }
    
    @GetMapping
    public List<Feedback> getAllFeedback(){

        return feedbackRepository.findAll();

    }
}