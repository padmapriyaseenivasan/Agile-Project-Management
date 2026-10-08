package com.example.agileprojectmanagementsystem.service;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.agileprojectmanagementsystem.entity.Sprint;
import com.example.agileprojectmanagementsystem.entity.Task;
import com.example.agileprojectmanagementsystem.entity.User;
import com.example.agileprojectmanagementsystem.repository.SprintRepository;
import com.example.agileprojectmanagementsystem.repository.TaskRepository;
import com.example.agileprojectmanagementsystem.repository.UserRepository;

@Service
public class TaskService {

    private static final Set<String> STATUSES = Set.of("TODO", "IN_PROGRESS", "DONE");
    private static final Set<String> PRIORITIES = Set.of("LOW", "MEDIUM", "HIGH");

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final SprintRepository sprintRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository,
                       SprintRepository sprintRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.sprintRepository = sprintRepository;
    }

    // Everybody (admin and team members) can SEE all tasks
    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return findTask(id);
    }

    // ADMIN only. userId optional; sprintId null/0 = product backlog
    public Task addTask(Task task, Long userId, Long sprintId, Authentication auth) {
        requireAdmin(auth);

        if (task.getStatus() == null) task.setStatus("TODO");
        if (task.getPriority() == null) task.setPriority("MEDIUM");
        requireValid(task.getStatus(), STATUSES, "status");
        requireValid(task.getPriority(), PRIORITIES, "priority");

        task.setId(null);
        task.setAssignedTo(userId == null ? null : findTeamMember(userId));
        task.setSprint(sprintId == null || sprintId == 0 ? null : findSprint(sprintId));

        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task, Long userId, Long sprintId, Authentication auth) {
        User current = currentUser(auth);
        Task existing = findTask(id);

        if (isAdmin(current)) {
            if (task.getTaskName() != null && !task.getTaskName().isBlank()) {
                existing.setTaskName(task.getTaskName());
            }
            existing.setDescription(task.getDescription());
            if (task.getStatus() != null) {
                requireValid(task.getStatus(), STATUSES, "status");
                existing.setStatus(task.getStatus());
            }
            if (task.getPriority() != null) {
                requireValid(task.getPriority(), PRIORITIES, "priority");
                existing.setPriority(task.getPriority());
            }
            if (userId != null) {
                existing.setAssignedTo(findTeamMember(userId));
            }
            if (sprintId != null) {
                existing.setSprint(sprintId == 0 ? null : findSprint(sprintId)); // 0 = back to backlog
            }
            return taskRepository.save(existing);
        }

        // TEAM MEMBER: only their OWN task, and only its status
        if (existing.getAssignedTo() == null || !existing.getAssignedTo().getId().equals(current.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can update only your own tasks");
        }
        requireValid(task.getStatus(), STATUSES, "status");
        existing.setStatus(task.getStatus());
        return taskRepository.save(existing);
    }

    // ADMIN only
    public String deleteTask(Long id, Authentication auth) {
        requireAdmin(auth);
        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found");
        }
        taskRepository.deleteById(id);
        return "Task deleted successfully";
    }

    // ---------- helpers ----------

    private void requireValid(String value, Set<String> allowed, String field) {
        if (value == null || !allowed.contains(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid " + field + ": " + value);
        }
    }

    private Task findTask(Long id) {
        return taskRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    private Sprint findSprint(Long id) {
        return sprintRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Sprint not found"));
    }

    private User findTeamMember(Long id) {
        User u = userRepository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Team member not found"));
        if (!"TEAM_MEMBER".equals(u.getRole())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tasks can only be assigned to a team member");
        }
        return u;
    }

    private User currentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Logged-in user not found"));
    }

    private void requireAdmin(Authentication auth) {
        if (!isAdmin(currentUser(auth))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the admin can do this");
        }
    }

    private boolean isAdmin(User u) {
        return "ADMIN".equals(u.getRole());
    }
}
