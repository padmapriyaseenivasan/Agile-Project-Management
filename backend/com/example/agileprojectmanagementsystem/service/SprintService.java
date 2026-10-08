package com.example.agileprojectmanagementsystem.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.agileprojectmanagementsystem.entity.Project;
import com.example.agileprojectmanagementsystem.entity.Sprint;
import com.example.agileprojectmanagementsystem.repository.ProjectRepository;
import com.example.agileprojectmanagementsystem.repository.SprintRepository;
import com.example.agileprojectmanagementsystem.repository.TaskRepository;

@Service
public class SprintService {

    private final SprintRepository repo;
    private final ProjectRepository projectRepo;
    private final TaskRepository taskRepo;

    public SprintService(SprintRepository repo, ProjectRepository projectRepo, TaskRepository taskRepo) {
        this.repo = repo;
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
    }

    public Sprint addSprint(Sprint sprint, Long projectId) {
        validateDates(sprint);
        sprint.setId(null);
        sprint.setProject(findProject(projectId));
        if (sprint.getStatus() == null) sprint.setStatus("PLANNED");
        return repo.save(sprint);
    }

    public List<Sprint> getSprints(Long projectId) {
        return projectId == null ? repo.findAll() : repo.findByProjectId(projectId);
    }

    public Sprint getSprintById(Long id) {
        return repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Sprint not found"));
    }

    public Sprint updateSprint(Long id, Sprint sprint, Long projectId) {
        validateDates(sprint);
        Sprint existing = getSprintById(id);
        existing.setSprintName(sprint.getSprintName());
        existing.setStartDate(sprint.getStartDate());
        existing.setEndDate(sprint.getEndDate());
        existing.setStatus(sprint.getStatus());
        if (projectId != null) {
            existing.setProject(findProject(projectId));
        }
        return repo.save(existing);
    }

    public String deleteSprint(Long id) {
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Sprint not found");
        }
        if (taskRepo.existsBySprintId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This sprint has tasks. Move or delete the tasks first.");
        }
        repo.deleteById(id);
        return "Sprint deleted successfully";
    }

    private Project findProject(Long projectId) {
        if (projectId == null) return null;
        return projectRepo.findById(projectId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private void validateStatus(Sprint s) {
        if (s.getStatus() != null && !List.of("PLANNED", "ACTIVE", "COMPLETED").contains(s.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid sprint status");
        }
    }

    private void validateDates(Sprint s) {
        validateStatus(s);
        if (s.getStartDate() != null && s.getEndDate() != null && s.getEndDate().isBefore(s.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "End date cannot be before start date");
        }
    }
}
