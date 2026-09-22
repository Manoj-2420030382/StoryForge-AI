package com.storyforge.project.dto;

import jakarta.validation.constraints.Size;

public class UpdateProjectRequest {

    @Size(max = 150)
    private String name;

    @Size(max = 1000)
    private String description;

    private String status;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}