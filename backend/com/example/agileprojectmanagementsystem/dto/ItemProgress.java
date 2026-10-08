package com.example.agileprojectmanagementsystem.dto;

public record ItemProgress(Long id, String name, long total, long done, int percent) {
}
