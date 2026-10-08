package com.example.agileprojectmanagementsystem.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.agileprojectmanagementsystem.entity.User;
import com.example.agileprojectmanagementsystem.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping                      // public: register
    public User addUser(@Valid @RequestBody User user) {
        return service.addUser(user);
    }

    @GetMapping                       // admin only (SecurityConfig)
    public List<User> getUsers() {
        return service.getUsers();
    }

    @GetMapping("/me")
    public User getCurrentUser(Authentication auth) {
        return service.getUserByEmail(auth.getName());
    }

    @GetMapping("/{id}")              // admin only (SecurityConfig)
    public User getUserById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @PutMapping("/{id}")              // self or admin (checked in service)
    public User updateUser(@PathVariable Long id, @RequestBody User user, Authentication auth) {
        return service.updateUser(id, user, auth);
    }

    @DeleteMapping("/{id}")           // admin only (SecurityConfig)
    public String deleteUser(@PathVariable Long id, Authentication auth) {
        return service.deleteUser(id, auth);
    }
}
