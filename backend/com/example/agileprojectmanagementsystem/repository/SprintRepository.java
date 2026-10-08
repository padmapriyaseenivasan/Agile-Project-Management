package com.example.agileprojectmanagementsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agileprojectmanagementsystem.entity.Sprint;

public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProjectId(Long projectId);
    boolean existsByProjectId(Long projectId);
}
