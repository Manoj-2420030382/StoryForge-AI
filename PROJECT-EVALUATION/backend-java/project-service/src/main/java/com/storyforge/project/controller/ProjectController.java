package com.storyforge.project.controller;

import com.storyforge.project.dto.CreateProjectRequest;
import com.storyforge.project.dto.ProjectResponse;
import com.storyforge.project.dto.UpdateProjectRequest;
import com.storyforge.project.service.ProjectService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final com.storyforge.project.service.ProjectReportService projectReportService;

    public ProjectController(
            ProjectService projectService,
            com.storyforge.project.service.ProjectReportService projectReportService) {

        this.projectService = projectService;
        this.projectReportService = projectReportService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            Authentication authentication) {

        Long userId =
                Long.valueOf(
                    authentication.getPrincipal().toString()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                    projectService.createProject(
                        request,
                        userId
                    )
                );
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>>
            getMyProjects(
                Authentication authentication) {

        Long userId =
                Long.valueOf(
                    authentication.getPrincipal().toString()
                );

        return ResponseEntity.ok(
            projectService.getMyProjects(userId)
        );
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProject(
            @PathVariable Long projectId,
            Authentication authentication) {

        Long userId =
                Long.valueOf(
                    authentication.getPrincipal().toString()
                );

        return ResponseEntity.ok(
            projectService.getProject(
                projectId,
                userId
            )
        );
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long projectId,
            @Valid @RequestBody UpdateProjectRequest request,
            Authentication authentication) {

        Long userId =
                Long.valueOf(
                    authentication.getPrincipal().toString()
                );

        return ResponseEntity.ok(
            projectService.updateProject(
                projectId,
                request,
                userId
            )
        );
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId,
            Authentication authentication) {

        Long userId =
                Long.valueOf(
                    authentication.getPrincipal().toString()
                );

        projectService.deleteProject(
            projectId,
            userId
        );

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{projectId}/export/docx")
    public ResponseEntity<byte[]> exportProjectDocx(
            @PathVariable Long projectId,
            @RequestHeader("Authorization") String token,
            Authentication authentication) {

        Long userId = Long.valueOf(authentication.getPrincipal().toString());

        try {
            byte[] docx = projectReportService.generateProjectReportDocx(projectId, userId, token);
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.add(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"StoryForge_AI_Project_Report.docx\"");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                    .body(docx);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}