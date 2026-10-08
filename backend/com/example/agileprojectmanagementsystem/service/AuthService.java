package com.example.agileprojectmanagementsystem.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.agileprojectmanagementsystem.dto.LoginRequest;
import com.example.agileprojectmanagementsystem.entity.User;
import com.example.agileprojectmanagementsystem.repository.UserRepository;
import com.example.agileprojectmanagementsystem.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // one generic message for every failure (no user enumeration)
        if (user == null
                || !user.getRole().equals(request.getRole())
                || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid role, email or password");
        }
        return jwtService.generateToken(user);
    }
}
