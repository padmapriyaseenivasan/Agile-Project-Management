package com.example.agileprojectmanagementsystem.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.agileprojectmanagementsystem.entity.Project;
import com.example.agileprojectmanagementsystem.service.ProjectService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    public Project addProject(@Valid @RequestBody Project project) {
        return service.addProject(project);
    }

    @GetMapping
    public List<Project> getProjects() {
        return service.getProjects();
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return service.getProjectById(id);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @Valid @RequestBody Project project) {
        return service.updateProject(id, project);
    }

    @DeleteMapping("/{id}")
    public String deleteProject(@PathVariable Long id) {
        return service.deleteProject(id);
    }
}
