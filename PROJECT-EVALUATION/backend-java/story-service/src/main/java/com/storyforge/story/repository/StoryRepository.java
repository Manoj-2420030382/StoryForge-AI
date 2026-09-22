package com.storyforge.story.repository;

import com.storyforge.story.entity.Story;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StoryRepository
        extends JpaRepository<Story, Long> {

    List<Story> findByProjectIdOrderByCreatedAtDesc(
            Long projectId
    );

    Optional<Story> findByIdAndCreatedBy(
            Long id,
            Long createdBy
    );

    Optional<Story> findByIdAndProjectId(
            Long id,
            Long projectId
    );
}