package com.storyforge.ai.controller;

import com.storyforge.ai.dto.AiRefinementRequest;
import com.storyforge.ai.service.AiOrchestrationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiOrchestrationController {

    private final AiOrchestrationService aiOrchestrationService;

    public AiOrchestrationController(
            AiOrchestrationService aiOrchestrationService) {
        this.aiOrchestrationService = aiOrchestrationService;
    }

    @PostMapping("/refine")
    public ResponseEntity<Object> refineStory(
            @RequestBody AiRefinementRequest request) {

        return ResponseEntity.ok(
                aiOrchestrationService.startRefinement(request)
        );
    }
}