package com.storyforge.project.service;

import com.storyforge.project.dto.StoryDto;
import com.storyforge.project.entity.Project;
import com.storyforge.project.generator.DocxReportGenerator;
import com.storyforge.project.repository.ProjectRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Service
public class ProjectReportService {

    private final ProjectRepository projectRepository;
    private final RestTemplate restTemplate;
    private final DocxReportGenerator docxReportGenerator;

    public ProjectReportService(ProjectRepository projectRepository, RestTemplate restTemplate, DocxReportGenerator docxReportGenerator) {
        this.projectRepository = projectRepository;
        this.restTemplate = restTemplate;
        this.docxReportGenerator = docxReportGenerator;
    }

    public byte[] generateProjectReportDocx(Long projectId, Long ownerId, String token) throws IOException {
        // 1. Validate project access
        Project project = projectRepository.findByIdAndOwnerId(projectId, ownerId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found or unauthorized"));

        // 2. Fetch stories from story-service securely
        List<StoryDto> stories = fetchStoriesForProject(projectId, token);

        // 3. Generate DOCX
        return docxReportGenerator.generateProjectReport(project, stories);
    }

    @SuppressWarnings("null")
    private List<StoryDto> fetchStoriesForProject(Long projectId, String token) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String url = "http://story-service/api/projects/" + projectId + "/stories";
            
            ResponseEntity<List<StoryDto>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<StoryDto>>() {}
            );

            if (response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            // Log the exception in a real application
            System.err.println("Failed to fetch stories: " + e.getMessage());
        }
        return Collections.emptyList();
    }
}
