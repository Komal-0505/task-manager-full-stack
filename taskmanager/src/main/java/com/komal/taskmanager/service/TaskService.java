/*package com.komal.taskmanager.service;

public class TaskService.javaTaskService {
    
}
*/

package com.komal.taskmanager.service;

import com.komal.taskmanager.entity.Task;
import com.komal.taskmanager.repository.TaskRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    // Constructor Injection
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get task by ID
    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    // Create a new task
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    // Update an existing task
    public Task updateTask(Long id, Task updatedTask) {

        Task existingTask = taskRepository.findById(id).orElse(null);

        if (existingTask != null) {

            existingTask.setTitle(updatedTask.getTitle());
            existingTask.setDescription(updatedTask.getDescription());
            existingTask.setPriority(updatedTask.getPriority());
            existingTask.setStatus(updatedTask.getStatus());
            existingTask.setDueDate(updatedTask.getDueDate());

            return taskRepository.save(existingTask);
        }

        return null;
    }

    // Delete a task
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}