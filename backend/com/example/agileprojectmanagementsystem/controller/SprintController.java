package com.example.agileprojectmanagementsystem.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.agileprojectmanagementsystem.entity.Sprint;
import com.example.agileprojectmanagementsystem.service.SprintService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/sprints")
public class SprintController {

    private final SprintService service;

    public SprintController(SprintService service) {
        this.service = service;
    }

    // POST /sprints?projectId=1
    @PostMapping
    public Sprint addSprint(@Valid @RequestBody Sprint sprint,
                            @RequestParam(required = false) Long projectId) {
        return service.addSprint(sprint, projectId);
    }

    // GET /sprints   or   GET /sprints?projectId=1
    @GetMapping
    public List<Sprint> getSprints(@RequestParam(required = false) Long projectId) {
        return service.getSprints(projectId);
    }

    @GetMapping("/{id}")
    public Sprint getSprintById(@PathVariable Long id) {
        return service.getSprintById(id);
    }

    @PutMapping("/{id}")
    public Sprint updateSprint(@PathVariable Long id, @Valid @RequestBody Sprint sprint,
                               @RequestParam(required = false) Long projectId) {
        return service.updateSprint(id, sprint, projectId);
    }

    @DeleteMapping("/{id}")
    public String deleteSprint(@PathVariable Long id) {
        return service.deleteSprint(id);
    }
}
