package com.garden.garden_helper.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.garden.garden_helper.entity.Service;

public interface ServiceRepository extends JpaRepository<Service, Long> {
}