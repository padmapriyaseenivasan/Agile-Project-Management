package com.example.agileprojectmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.agileprojectmanagementsystem.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
