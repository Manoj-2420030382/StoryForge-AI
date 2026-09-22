package com.storyforge.story.service;

import com.storyforge.story.dto.CreateStoryRequest;
import com.storyforge.story.dto.StoryResponse;
import com.storyforge.story.dto.UpdateStoryRequest;
import com.storyforge.story.entity.AiRefinementStatus;
import com.storyforge.story.entity.Story;
import com.storyforge.story.entity.StoryPriority;
import com.storyforge.story.entity.StoryStatus;
import com.storyforge.story.repository.StoryRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoryService {

    private final StoryRepository storyRepository;

    public StoryService(
            StoryRepository storyRepository) {

        this.storyRepository = storyRepository;
    }

    public StoryResponse createStory(
            Long projectId,
            CreateStoryRequest request,
            Long userId) {

        Story story = new Story();

        story.setProjectId(projectId);
        story.setCreatedBy(userId);

        story.setTitle(
                request.getTitle().trim()
        );

        story.setDescription(
                request.getDescription().trim()
        );

        story.setAcceptanceCriteria(
                request.getAcceptanceCriteria()
        );

        story.setPriority(
                request.getPriority() != null
                    ? request.getPriority()
                    : StoryPriority.MEDIUM
        );

        story.setStatus(StoryStatus.DRAFT);

        story.setStoryPoints(
                request.getStoryPoints()
        );

        story.setAiRefinementStatus(
                AiRefinementStatus.NOT_ANALYZED
        );

        return new StoryResponse(
                storyRepository.save(story)
        );
    }

    public List<StoryResponse> getProjectStories(
            Long projectId) {

        return storyRepository
                .findByProjectIdOrderByCreatedAtDesc(
                        projectId
                )
                .stream()
                .map(StoryResponse::new)
                .toList();
    }

    public StoryResponse getStory(
            Long storyId,
            Long userId) {

        Story story =
                storyRepository
                    .findByIdAndCreatedBy(
                            storyId,
                            userId
                    )
                    .orElseThrow(() ->
                        new IllegalArgumentException(
                            "Story not found"
                        )
                    );

        return new StoryResponse(story);
    }

    public StoryResponse updateStory(
            Long storyId,
            UpdateStoryRequest request,
            Long userId) {

        Story story =
                storyRepository
                    .findByIdAndCreatedBy(
                            storyId,
                            userId
                    )
                    .orElseThrow(() ->
                        new IllegalArgumentException(
                            "Story not found"
                        )
                    );

        if (request.getTitle() != null
                && !request.getTitle().isBlank()) {

            story.setTitle(
                    request.getTitle().trim()
            );
        }

        if (request.getDescription() != null
                && !request.getDescription().isBlank()) {

            story.setDescription(
                    request.getDescription().trim()
            );
        }

        if (request.getAcceptanceCriteria() != null) {

            story.setAcceptanceCriteria(
                    request.getAcceptanceCriteria()
            );
        }

        if (request.getPriority() != null) {
            story.setPriority(
                    request.getPriority()
            );
        }

        if (request.getStatus() != null) {
            story.setStatus(
                    request.getStatus()
            );
        }

        if (request.getStoryPoints() != null) {
            story.setStoryPoints(
                    request.getStoryPoints()
            );
        }

        // If this is an AI update (request includes AI fields), save them.
        // Otherwise, it's a manual modification and the story should be analyzed again by AI.
        if (request.getAiRefinementStatus() != null) {
            story.setAiRefinementStatus(request.getAiRefinementStatus());
            story.setAiQualityScore(request.getAiQualityScore());
            story.setAiRefinementSummary(request.getAiRefinementSummary());
        } else {
            story.setAiRefinementStatus(AiRefinementStatus.NOT_ANALYZED);
            story.setAiQualityScore(null);
            story.setAiRefinementSummary(null);
        }

        return new StoryResponse(
                storyRepository.save(story)
        );
    }

    @SuppressWarnings("null")
    public void deleteStory(
            Long storyId,
            Long userId) {

        Story story =
                storyRepository
                    .findByIdAndCreatedBy(
                            storyId,
                            userId
                    )
                    .orElseThrow(() ->
                        new IllegalArgumentException(
                            "Story not found"
                        )
                    );

        storyRepository.delete(story);
    }
}