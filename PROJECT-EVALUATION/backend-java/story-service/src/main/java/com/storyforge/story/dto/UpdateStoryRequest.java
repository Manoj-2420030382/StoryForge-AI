package com.storyforge.story.dto;

import com.storyforge.story.entity.StoryPriority;
import com.storyforge.story.entity.StoryStatus;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class UpdateStoryRequest {

    @Size(max = 200)
    private String title;

    @Size(max = 5000)
    private String description;

    @Size(max = 10000)
    private String acceptanceCriteria;

    private StoryPriority priority;

    private StoryStatus status;

    @Min(0)
    @Max(100)
    private Integer storyPoints;

    private com.storyforge.story.entity.AiRefinementStatus aiRefinementStatus;

    @Min(0)
    @Max(100)
    private Double aiQualityScore;

    @Size(max = 2000)
    private String aiRefinementSummary;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAcceptanceCriteria() {
        return acceptanceCriteria;
    }

    public void setAcceptanceCriteria(
            String acceptanceCriteria) {

        this.acceptanceCriteria =
                acceptanceCriteria;
    }

    public StoryPriority getPriority() {
        return priority;
    }

    public void setPriority(StoryPriority priority) {
        this.priority = priority;
    }

    public StoryStatus getStatus() {
        return status;
    }

    public void setStatus(StoryStatus status) {
        this.status = status;
    }

    public Integer getStoryPoints() {
        return storyPoints;
    }

    public void setStoryPoints(Integer storyPoints) {
        this.storyPoints = storyPoints;
    }

    public com.storyforge.story.entity.AiRefinementStatus getAiRefinementStatus() {
        return aiRefinementStatus;
    }

    public void setAiRefinementStatus(com.storyforge.story.entity.AiRefinementStatus aiRefinementStatus) {
        this.aiRefinementStatus = aiRefinementStatus;
    }

    public Double getAiQualityScore() {
        return aiQualityScore;
    }

    public void setAiQualityScore(Double aiQualityScore) {
        this.aiQualityScore = aiQualityScore;
    }

    public String getAiRefinementSummary() {
        return aiRefinementSummary;
    }

    public void setAiRefinementSummary(String aiRefinementSummary) {
        this.aiRefinementSummary = aiRefinementSummary;
    }
}