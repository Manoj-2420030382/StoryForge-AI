package com.storyforge.ai.service;

import com.storyforge.ai.dto.AiRefinementRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class AiOrchestrationService {

    private final RestTemplate restTemplate;

    public AiOrchestrationService() {
        this.restTemplate = new RestTemplate();
    }

    public Object startRefinement(AiRefinementRequest request) {
        String pythonApiUrl = "http://localhost:8000/api/ai/pipeline";
        ResponseEntity<Object> response = restTemplate.postForEntity(pythonApiUrl, request, Object.class);
        return response.getBody();
    }
}