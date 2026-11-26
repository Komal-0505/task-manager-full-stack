/*import axios from 'axios'

const API_URL = 'http://localhost:8080/api/tasks'

export function getAllTasks() {
  return axios.get(API_URL)
}
*/

import axios from 'axios'

const API_URL = 'http://localhost:8080/api/tasks'

// Get all tasks
export function getAllTasks() {
  return axios.get(API_URL)
}

// Create a new task
export function createTask(task) {
  return axios.post(API_URL, task)
}

// Delete a task
export function deleteTask(id) {
  return axios.delete(`${API_URL}/${id}`)
}

// Update an existing task
export function updateTask(id, task) {
  return axios.put(`${API_URL}/${id}`, task)
}