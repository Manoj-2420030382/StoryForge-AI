package com.storyforge.ai.dto;

public class AiRefinementResponse {

    private Long storyId;

    private String status;

    private String message;

    public AiRefinementResponse() {
    }

    public AiRefinementResponse(Long storyId, String status, String message) {
        this.storyId = storyId;
        this.status = status;
        this.message = message;
    }

    public Long getStoryId() {
        return storyId;
    }

    public void setStoryId(Long storyId) {
        this.storyId = storyId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}