package com.storyforge.story.dto;

import com.storyforge.story.entity.*;

import java.time.LocalDateTime;

public class StoryResponse {

    private Long id;
    private Long projectId;
    private Long createdBy;
    private String title;
    private String description;
    private String acceptanceCriteria;
    private StoryPriority priority;
    private StoryStatus status;
    private Integer storyPoints;
    private AiRefinementStatus aiRefinementStatus;
    private Double aiQualityScore;
    private String aiRefinementSummary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StoryResponse(Story story) {

        this.id = story.getId();
        this.projectId = story.getProjectId();
        this.createdBy = story.getCreatedBy();
        this.title = story.getTitle();
        this.description = story.getDescription();
        this.acceptanceCriteria =
                story.getAcceptanceCriteria();
        this.priority = story.getPriority();
        this.status = story.getStatus();
        this.storyPoints = story.getStoryPoints();
        this.aiRefinementStatus =
                story.getAiRefinementStatus();
        this.aiQualityScore =
                story.getAiQualityScore();
        this.aiRefinementSummary =
                story.getAiRefinementSummary();
        this.createdAt = story.getCreatedAt();
        this.updatedAt = story.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getAcceptanceCriteria() {
        return acceptanceCriteria;
    }

    public StoryPriority getPriority() {
        return priority;
    }

    public StoryStatus getStatus() {
        return status;
    }

    public Integer getStoryPoints() {
        return storyPoints;
    }

    public AiRefinementStatus getAiRefinementStatus() {
        return aiRefinementStatus;
    }

    public Double getAiQualityScore() {
        return aiQualityScore;
    }

    public String getAiRefinementSummary() {
        return aiRefinementSummary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}