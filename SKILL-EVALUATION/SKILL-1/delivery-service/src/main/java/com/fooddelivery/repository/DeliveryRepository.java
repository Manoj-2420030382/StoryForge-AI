package com.fooddelivery.repository;

import com.fooddelivery.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryRepository
        extends JpaRepository<Delivery, Long> {

}