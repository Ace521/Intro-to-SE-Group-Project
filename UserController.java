package com.example.admin.controller;

import com.example.admin.model.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class UserController {

    @GetMapping("/api/users")
    public List<User> getUsers() {
        return Arrays.asList(
            new User(1, "Alice", "active"),
            new User(2, "Bob", "inactive"),
            new User(3, "Charlie", "active")
        );
    }
}
