package com.example.agileprojectmanagementsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agileprojectmanagementsystem.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long userId);
    List<Task> findBySprintId(Long sprintId);
    boolean existsBySprintId(Long sprintId);
}
