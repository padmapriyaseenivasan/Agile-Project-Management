package com.example.agileprojectmanagementsystem.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.agileprojectmanagementsystem.entity.Task;
import com.example.agileprojectmanagementsystem.service.TaskService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public List<Task> getTasks() {
        return service.getTasks();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return service.getTaskById(id);
    }

    // POST /tasks?userId=2&sprintId=1   (sprintId omitted or 0 = product backlog)
    @PostMapping
    public Task addTask(@Valid @RequestBody Task task,
                        @RequestParam(required = false) Long userId,
                        @RequestParam(required = false) Long sprintId,
                        Authentication auth) {
        return service.addTask(task, userId, sprintId, auth);
    }

    // PUT /tasks/5?userId=2&sprintId=1   (sprintId=0 moves it back to the backlog)
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task,
                           @RequestParam(required = false) Long userId,
                           @RequestParam(required = false) Long sprintId,
                           Authentication auth) {
        return service.updateTask(id, task, userId, sprintId, auth);
    }

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id, Authentication auth) {
        return service.deleteTask(id, auth);
    }
}
