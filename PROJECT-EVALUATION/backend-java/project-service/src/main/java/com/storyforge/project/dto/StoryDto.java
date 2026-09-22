package com.storyforge.project.dto;

import java.time.LocalDateTime;

public class StoryDto {
    private Long id;
    private Long projectId;
    private Long createdBy;
    private String title;
    private String description;
    private String acceptanceCriteria;
    private String priority;
    private String status;
    private Integer storyPoints;
    private String aiRefinementStatus;
    private Double aiQualityScore;
    private String aiRefinementSummary;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAcceptanceCriteria() { return acceptanceCriteria; }
    public void setAcceptanceCriteria(String acceptanceCriteria) { this.acceptanceCriteria = acceptanceCriteria; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Integer getStoryPoints() { return storyPoints; }
    public void setStoryPoints(Integer storyPoints) { this.storyPoints = storyPoints; }
    
    public String getAiRefinementStatus() { return aiRefinementStatus; }
    public void setAiRefinementStatus(String aiRefinementStatus) { this.aiRefinementStatus = aiRefinementStatus; }
    
    public Double getAiQualityScore() { return aiQualityScore; }
    public void setAiQualityScore(Double aiQualityScore) { this.aiQualityScore = aiQualityScore; }
    
    public String getAiRefinementSummary() { return aiRefinementSummary; }
    public void setAiRefinementSummary(String aiRefinementSummary) { this.aiRefinementSummary = aiRefinementSummary; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
