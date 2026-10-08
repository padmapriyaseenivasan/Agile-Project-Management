package com.example.agileprojectmanagementsystem.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.agileprojectmanagementsystem.entity.Project;
import com.example.agileprojectmanagementsystem.repository.ProjectRepository;
import com.example.agileprojectmanagementsystem.repository.SprintRepository;

@Service
public class ProjectService {

    private final ProjectRepository repo;
    private final SprintRepository sprintRepo;

    public ProjectService(ProjectRepository repo, SprintRepository sprintRepo) {
        this.repo = repo;
        this.sprintRepo = sprintRepo;
    }

    public Project addProject(Project project) {
        validateDates(project);
        project.setId(null);
        return repo.save(project);
    }

    public List<Project> getProjects() {
        return repo.findAll();
    }

    public Project getProjectById(Long id) {
        return repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    public Project updateProject(Long id, Project project) {
        validateDates(project);
        Project existing = getProjectById(id);
        existing.setProjectName(project.getProjectName());
        existing.setDescription(project.getDescription());
        existing.setStartDate(project.getStartDate());
        existing.setEndDate(project.getEndDate());
        return repo.save(existing);
    }

    public String deleteProject(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
        }
        if (sprintRepo.existsByProjectId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This project has sprints. Delete its sprints first.");
        }
        repo.deleteById(id);
        return "Project deleted successfully";
    }

    private void validateDates(Project p) {
        if (p.getStartDate() != null && p.getEndDate() != null && p.getEndDate().isBefore(p.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }
    }
}
