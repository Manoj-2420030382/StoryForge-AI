package com.storyforge.project.repository;

import com.storyforge.project.entity.Project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository
        extends JpaRepository<Project, Long> {

    List<Project> findByOwnerIdOrderByCreatedAtDesc(
            Long ownerId
    );

    Optional<Project> findByIdAndOwnerId(
            Long id,
            Long ownerId
    );
}