package com.example.agileprojectmanagementsystem.dto;

import java.util.List;

public record ProgressSummary(
        long totalTasks,
        long todo,
        long inProgress,
        long done,
        int overallPercent,
        List<ItemProgress> projects,
        List<ItemProgress> sprints) {
}
