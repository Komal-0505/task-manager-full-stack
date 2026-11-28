package com.komal.taskmanager.service;

import com.komal.taskmanager.entity.Task;
import com.komal.taskmanager.entity.User;
import com.komal.taskmanager.repository.TaskRepository;
import com.komal.taskmanager.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(
            TaskRepository taskRepository,
            UserRepository userRepository) {

        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    // Find the logged-in user using their email
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    // Get only this user's tasks
    public List<Task> getAllTasks(String email) {
        User user = getUserByEmail(email);
        return taskRepository.findAllByUser(user);
    }

    // Get a task only if it belongs to this user
    public Task getTaskById(Long id, String email) {
        User user = getUserByEmail(email);

        return taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Task not found!"));
    }

    // Create a task for the logged-in user
    public Task createTask(Task task, String email) {
        User user = getUserByEmail(email);
        task.setUser(user);

        return taskRepository.save(task);
    }

    // Update only this user's task
    public Task updateTask(Long id, Task updatedTask, String email) {
        Task existingTask = getTaskById(id, email);

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setPriority(updatedTask.getPriority());
        existingTask.setStatus(updatedTask.getStatus());
        existingTask.setDueDate(updatedTask.getDueDate());

        return taskRepository.save(existingTask);
    }

    // Delete only this user's task
    public void deleteTask(Long id, String email) {
        Task task = getTaskById(id, email);
        taskRepository.delete(task);
    }
}