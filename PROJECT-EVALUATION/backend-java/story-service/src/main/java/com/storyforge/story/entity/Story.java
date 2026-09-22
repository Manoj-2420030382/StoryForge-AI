package com.storyforge.story.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "stories",
    indexes = {
        @Index(
            name = "idx_stories_project",
            columnList = "project_id"
        ),
        @Index(
            name = "idx_stories_created_by",
            columnList = "created_by"
        )
    }
)
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 5000)
    private String description;

    @Column(name = "acceptance_criteria", length = 10000)
    private String acceptanceCriteria;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StoryPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StoryStatus status;

    @Column(name = "story_points")
    private Integer storyPoints;

    @Enumerated(EnumType.STRING)
    @Column(name = "ai_refinement_status",
            nullable = false,
            length = 30)
    private AiRefinementStatus aiRefinementStatus;

    @Column(name = "ai_quality_score")
    private Double aiQualityScore;

    @Column(name = "ai_refinement_summary",
            length = 5000)
    private String aiRefinementSummary;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (priority == null) {
            priority = StoryPriority.MEDIUM;
        }

        if (status == null) {
            status = StoryStatus.DRAFT;
        }

        if (aiRefinementStatus == null) {
            aiRefinementStatus =
                    AiRefinementStatus.NOT_ANALYZED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Story() {
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAcceptanceCriteria(
            String acceptanceCriteria) {

        this.acceptanceCriteria = acceptanceCriteria;
    }

    public void setPriority(StoryPriority priority) {
        this.priority = priority;
    }

    public void setStatus(StoryStatus status) {
        this.status = status;
    }

    public void setStoryPoints(Integer storyPoints) {
        this.storyPoints = storyPoints;
    }

    public void setAiRefinementStatus(
            AiRefinementStatus aiRefinementStatus) {

        this.aiRefinementStatus =
                aiRefinementStatus;
    }

    public void setAiQualityScore(
            Double aiQualityScore) {

        this.aiQualityScore = aiQualityScore;
    }

    public void setAiRefinementSummary(
            String aiRefinementSummary) {

        this.aiRefinementSummary =
                aiRefinementSummary;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}