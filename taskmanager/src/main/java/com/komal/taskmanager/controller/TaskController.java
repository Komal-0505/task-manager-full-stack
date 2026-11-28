package com.komal.taskmanager.controller;

import com.komal.taskmanager.entity.Task;
import com.komal.taskmanager.service.TaskService;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Get only the logged-in user's tasks
    @GetMapping
    public List<Task> getAllTasks(Principal principal) {
        return taskService.getAllTasks(principal.getName());
    }

    // Get a task only if it belongs to the logged-in user
    @GetMapping("/{id}")
    public Task getTaskById(
            @PathVariable Long id,
            Principal principal) {
        return taskService.getTaskById(id, principal.getName());
    }

    // Create a task for the logged-in user
    @PostMapping
    public Task createTask(
            @RequestBody Task task,
            Principal principal) {
        return taskService.createTask(task, principal.getName());
    }

    // Update only the logged-in user's task
    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @RequestBody Task task,
            Principal principal) {
        return taskService.updateTask(id, task, principal.getName());
    }

    // Delete only the logged-in user's task
    @DeleteMapping("/{id}")
    public String deleteTask(
            @PathVariable Long id,
            Principal principal) {
        taskService.deleteTask(id, principal.getName());
        return "Task deleted successfully!";
    }
}