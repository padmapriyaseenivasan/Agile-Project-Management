package com.example.agileprojectmanagementsystem.service;

import java.util.List;
import java.util.function.Predicate;

import org.springframework.stereotype.Service;

import com.example.agileprojectmanagementsystem.dto.ItemProgress;
import com.example.agileprojectmanagementsystem.dto.ProgressSummary;
import com.example.agileprojectmanagementsystem.entity.Task;
import com.example.agileprojectmanagementsystem.repository.ProjectRepository;
import com.example.agileprojectmanagementsystem.repository.SprintRepository;
import com.example.agileprojectmanagementsystem.repository.TaskRepository;

@Service
public class ProgressService {

    private final TaskRepository taskRepository;
    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;

    public ProgressService(TaskRepository taskRepository, SprintRepository sprintRepository,
                           ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.sprintRepository = sprintRepository;
        this.projectRepository = projectRepository;
    }

    public ProgressSummary getSummary() {
        List<Task> tasks = taskRepository.findAll();

        long todo = count(tasks, t -> "TODO".equals(t.getStatus()));
        long inProgress = count(tasks, t -> "IN_PROGRESS".equals(t.getStatus()));
        long done = count(tasks, t -> "DONE".equals(t.getStatus()));

        // Task progress is counted per project and per sprint
        List<ItemProgress> projects = projectRepository.findAll().stream()
                .map(p -> build(p.getId(), p.getProjectName(), tasks,
                        t -> t.getSprint() != null
                                && t.getSprint().getProject() != null
                                && p.getId().equals(t.getSprint().getProject().getId())))
                .toList();

        List<ItemProgress> sprints = sprintRepository.findAll().stream()
                .map(s -> build(s.getId(), s.getSprintName(), tasks,
                        t -> t.getSprint() != null && s.getId().equals(t.getSprint().getId())))
                .toList();

        return new ProgressSummary(tasks.size(), todo, inProgress, done,
                percent(done, tasks.size()), projects, sprints);
    }

    private ItemProgress build(Long id, String name, List<Task> tasks, Predicate<Task> belongs) {
        long total = count(tasks, belongs);
        long done = count(tasks, belongs.and(t -> "DONE".equals(t.getStatus())));
        return new ItemProgress(id, name, total, done, percent(done, total));
    }

    private long count(List<Task> tasks, Predicate<Task> p) {
        return tasks.stream().filter(p).count();
    }

    private int percent(long done, long total) {
        return total == 0 ? 0 : (int) Math.round(done * 100.0 / total);
    }
}
