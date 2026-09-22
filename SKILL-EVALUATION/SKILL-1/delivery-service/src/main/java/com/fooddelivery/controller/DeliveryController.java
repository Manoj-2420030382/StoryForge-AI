package com.fooddelivery.controller;

import com.fooddelivery.entity.Delivery;
import com.fooddelivery.repository.DeliveryRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/deliveries")
public class DeliveryController {

    private final DeliveryRepository repository;

    public DeliveryController(DeliveryRepository repository) {
        this.repository = repository;
    }

    // Get all deliveries
    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return repository.findAll();
    }

    // Get delivery by ID
    @GetMapping("/{id}")
    public Delivery getDelivery(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // Create delivery
    @PostMapping
    public Delivery createDelivery(
            @RequestBody Delivery delivery) {

        return repository.save(delivery);
    }

    // Update delivery
    @PutMapping("/{id}")
    public Delivery updateDelivery(
            @PathVariable Long id,
            @RequestBody Delivery delivery) {

        Delivery existing =
                repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setOrderId(delivery.getOrderId());
        existing.setDeliveryPerson(
                delivery.getDeliveryPerson());
        existing.setAddress(delivery.getAddress());
        existing.setStatus(delivery.getStatus());

        return repository.save(existing);
    }

    // Delete delivery
    @DeleteMapping("/{id}")
    public String deleteDelivery(@PathVariable Long id) {

        repository.deleteById(id);

        return "Delivery deleted successfully";
    }
}