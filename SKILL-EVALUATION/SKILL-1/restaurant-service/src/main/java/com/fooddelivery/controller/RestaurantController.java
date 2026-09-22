package com.fooddelivery.controller;

import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.repository.RestaurantRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantRepository repository;

    public RestaurantController(RestaurantRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Restaurant getRestaurant(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PostMapping
    public Restaurant createRestaurant(@RequestBody Restaurant restaurant) {
        return repository.save(restaurant);
    }

    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
            @PathVariable Long id,
            @RequestBody Restaurant restaurant) {

        Restaurant existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setName(restaurant.getName());
        existing.setAddress(restaurant.getAddress());
        existing.setPhone(restaurant.getPhone());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public String deleteRestaurant(@PathVariable Long id) {
        repository.deleteById(id);
        return "Restaurant deleted successfully";
    }
}