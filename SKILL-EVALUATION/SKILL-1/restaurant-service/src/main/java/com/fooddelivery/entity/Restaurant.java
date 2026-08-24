package com.fooddelivery.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String phone;

    // Default constructor
    public Restaurant() {
    }

    // Get ID
    public Long getId() {
        return id;
    }

    // Set ID
    public void setId(Long id) {
        this.id = id;
    }

    // Get name
    public String getName() {
        return name;
    }

    // Set name
    public void setName(String name) {
        this.name = name;
    }

    // Get address
    public String getAddress() {
        return address;
    }

    // Set address
    public void setAddress(String address) {
        this.address = address;
    }

    // Get phone
    public String getPhone() {
        return phone;
    }

    // Set phone
    public void setPhone(String phone) {
        this.phone = phone;
    }
}