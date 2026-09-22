package com.storyforge.project.service;

import com.storyforge.project.dto.CreateProjectRequest;
import com.storyforge.project.dto.ProjectResponse;
import com.storyforge.project.dto.UpdateProjectRequest;
import com.storyforge.project.entity.Project;
import com.storyforge.project.repository.ProjectRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(
            ProjectRepository projectRepository) {

        this.projectRepository = projectRepository;
    }

    public ProjectResponse createProject(
            CreateProjectRequest request,
            Long ownerId) {

        Project project = new Project();

        project.setName(
                request.getName().trim()
        );

        project.setDescription(
                request.getDescription()
        );

        project.setOwnerId(ownerId);
        project.setStatus("ACTIVE");

        Project saved =
                projectRepository.save(project);

        return new ProjectResponse(saved);
    }

    public List<ProjectResponse> getMyProjects(
            Long ownerId) {

        return projectRepository
                .findByOwnerIdOrderByCreatedAtDesc(ownerId)
                .stream()
                .map(ProjectResponse::new)
                .toList();
    }

    public ProjectResponse getProject(
            Long projectId,
            Long ownerId) {

        Project project =
                projectRepository
                    .findByIdAndOwnerId(
                            projectId,
                            ownerId
                    )
                    .orElseThrow(() ->
                        new IllegalArgumentException(
                            "Project not found"
                        )
                    );

        return new ProjectResponse(project);
    }

    @SuppressWarnings("null")
    public ProjectResponse updateProject(
            Long projectId,
            UpdateProjectRequest request,
            Long ownerId) {

        Project project =
                projectRepository
                    .findByIdAndOwnerId(
                            projectId,
                            ownerId
                    )
                    .orElseThrow(() ->
                        new IllegalArgumentException(
                            "Project not found"
                        )
                    );

        if (request.getName() != null
                && !request.getName().isBlank()) {

            project.setName(
                    request.getName().trim()
            );
        }

        if (request.getDescription() != null) {

            project.setDescription(
                    request.getDescription()
            );
        }

        if (request.getStatus() != null
                && !request.getStatus().isBlank()) {

            project.setStatus(
                    request.getStatus()
            );
        }

        Project updated =
                projectRepository.save(project);

        return new ProjectResponse(updated);
    }

    @SuppressWarnings("null")
    public void deleteProject(
            Long projectId,
            Long ownerId) {

        Project project =
                projectRepository
                    .findByIdAndOwnerId(
                            projectId,
                            ownerId
                    )
                    .orElseThrow(() ->
                        new IllegalArgumentException(
                            "Project not found"
                        )
                    );

        projectRepository.delete(project);
    }
}