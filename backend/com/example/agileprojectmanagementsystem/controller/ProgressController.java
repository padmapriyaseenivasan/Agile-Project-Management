package com.example.agileprojectmanagementsystem.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agileprojectmanagementsystem.dto.ProgressSummary;
import com.example.agileprojectmanagementsystem.service.ProgressService;

@RestController
@RequestMapping("/progress")
public class ProgressController {

    private final ProgressService service;

    public ProgressController(ProgressService service) {
        this.service = service;
    }

    // overall + per project + per sprint (any logged-in user)
    @GetMapping
    public ProgressSummary getProgress() {
        return service.getSummary();
    }
}
