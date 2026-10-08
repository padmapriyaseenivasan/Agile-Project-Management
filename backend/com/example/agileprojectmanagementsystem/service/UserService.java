package com.example.agileprojectmanagementsystem.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.agileprojectmanagementsystem.entity.User;
import com.example.agileprojectmanagementsystem.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTER - role is always forced to TEAM_MEMBER
    public User addUser(User user) {
        if (repo.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        user.setId(null);
        user.setRole("TEAM_MEMBER");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public List<User> getUsers() {
        return repo.findAll();
    }

    public User getUserById(Long id) {
        return repo.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public User getUserByEmail(String email) {
        return repo.findByEmail(email).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    // UPDATE - self or admin. Role is NEVER changed here.
    public User updateUser(Long id, User user, Authentication auth) {
        User current = getUserByEmail(auth.getName());
        boolean isAdmin = "ADMIN".equals(current.getRole());

        if (!isAdmin && !current.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can update only your own profile");
        }

        User existing = getUserById(id);

        if (user.getName() != null && !user.getName().isBlank()) {
            existing.setName(user.getName());
        }

        if (user.getEmail() != null && !user.getEmail().equals(existing.getEmail())) {
            if (repo.existsByEmail(user.getEmail())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
            }
            existing.setEmail(user.getEmail());
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return repo.save(existing);
    }

    // DELETE - admin only (SecurityConfig), cannot delete yourself
    public String deleteUser(Long id, Authentication auth) {
        User current = getUserByEmail(auth.getName());

        if (current.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You cannot delete your own account");
        }
        if (!repo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        repo.deleteById(id); // FK conflict -> 409 via GlobalExceptionHandler
        return "User deleted successfully";
    }
}
