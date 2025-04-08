package com.example.admin.model;

public class User {
    private int id;
    private String name;
    private String status;

    public User(int id, String name, String status) {
        this.id = id;
        this.name = name;
        this.status = status;
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getStatus() { return status; }

    public void setId(int id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setStatus(String status) { this.status = status; }
}
