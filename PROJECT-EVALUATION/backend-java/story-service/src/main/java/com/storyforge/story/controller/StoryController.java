package com.storyforge.story.controller;

import com.storyforge.story.dto.CreateStoryRequest;
import com.storyforge.story.dto.StoryResponse;
import com.storyforge.story.dto.UpdateStoryRequest;
import com.storyforge.story.service.StoryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects/{projectId}/stories")
public class StoryController {

    private final StoryService storyService;

    public StoryController(
            StoryService storyService) {

        this.storyService = storyService;
    }

    @PostMapping
    public ResponseEntity<StoryResponse> createStory(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateStoryRequest request,
            Authentication authentication) {

        Long userId =
                Long.valueOf(
                    authentication.getPrincipal()
                            .toString()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    storyService.createStory(
                        projectId,
                        request,
                        userId
                    )
                );
    }

    @GetMapping
    public ResponseEntity<List<StoryResponse>>
            getProjectStories(
                @PathVariable Long projectId) {

        return ResponseEntity.ok(
            storyService.getProjectStories(projectId)
        );
    }

    @GetMapping("/{storyId}")
    public ResponseEntity<StoryResponse> getStory(
            @PathVariable Long projectId,
            @PathVariable Long storyId,
            Authentication authentication) {

        Long userId =
                Long.valueOf(
                    authentication.getPrincipal()
                            .toString()
                );

        return ResponseEntity.ok(
            storyService.getStory(
                storyId,
                userId
            )
        );
    }

    @PutMapping("/{storyId}")
    public ResponseEntity<StoryResponse> updateStory(
            @PathVariable Long projectId,
            @PathVariable Long storyId,
            @Valid @RequestBody UpdateStoryRequest request,
            Authentication authentication) {

        Long userId =
                Long.valueOf(
                    authentication.getPrincipal()
                            .toString()
                );

        return ResponseEntity.ok(
            storyService.updateStory(
                storyId,
                request,
                userId
            )
        );
    }

    @DeleteMapping("/{storyId}")
    public ResponseEntity<Void> deleteStory(
            @PathVariable Long projectId,
            @PathVariable Long storyId,
            Authentication authentication) {

        Long userId =
                Long.valueOf(
                    authentication.getPrincipal()
                            .toString()
                );

        storyService.deleteStory(
                storyId,
                userId
        );

        return ResponseEntity.noContent().build();
    }
}