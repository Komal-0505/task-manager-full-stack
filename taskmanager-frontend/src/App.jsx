/*import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
*/



import { useEffect, useState } from 'react'
import {
  createTask,
  getAllTasks,
  deleteTask,
  updateTask,
} from './services/taskService'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [statusFilter, setStatusFilter] = useState('ALL')
const [priorityFilter, setPriorityFilter] = useState('ALL')
const [sortOption, setSortOption] = useState('DEFAULT')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [status, setStatus] = useState('PENDING')
  const [dueDate, setDueDate] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllTasks()
      .then((response) => setTasks(response.data))
      .catch((error) => {
        console.error(error)
        setError('Could not load tasks.')
      })
      .finally(() => setLoading(false))
  }, [])

  function resetForm() {
    setTitle('')
    setDescription('')
    setPriority('MEDIUM')
    setStatus('PENDING')
    setDueDate('')
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()

if (trimmedTitle === '') {
  setError('Task title cannot be empty.')
  return
}

    setError('')

    const taskData = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
    }

    try {
      setSaving(true)

      if (editingId !== null) {
        const response = await updateTask(editingId, taskData)

        setTasks((previousTasks) =>
          previousTasks.map((task) =>
            task.id === editingId ? response.data : task
          )
        )
      } else {
        const response = await createTask(taskData)

        setTasks((previousTasks) => [...previousTasks, response.data])
      }

      resetForm()
    } catch (error) {
      console.error(error)
      setError('Could not save task. Please try again.')
    } finally {
      setSaving(false)
    }
  }


  async function handleToggleStatus(task) {
  const updatedTask = {
    ...task,
    status: task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED',
  }

  try {
    const response = await updateTask(task.id, updatedTask)

    setTasks((previousTasks) =>
      previousTasks.map((item) =>
        item.id === task.id ? response.data : item
      )
    )
  } catch (error) {
    console.error(error)
    setError('Could not update task status.')
  }
}

  function handleEdit(task) {
    setEditingId(task.id)
    setTitle(task.title)
    setDescription(task.description || '')
    setPriority(task.priority)
    setStatus(task.status)
    setDueDate(task.dueDate || '')
    setError('')
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      await deleteTask(id)

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== id)
      )

      if (editingId === id) {
        resetForm()
      }
    } catch (error) {
      console.error(error)
      setError('Could not delete task.')
    }
  }

const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase())

  const matchesStatus =
    statusFilter === 'ALL' || task.status === statusFilter

  const matchesPriority =
    priorityFilter === 'ALL' || task.priority === priorityFilter

  return matchesSearch && matchesStatus && matchesPriority
})

const sortedTasks = [...filteredTasks].sort((a, b) => {
  if (sortOption === 'EARLIEST') {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate) - new Date(b.dueDate)
  }

  if (sortOption === 'LATEST') {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(b.dueDate) - new Date(a.dueDate)
  }

  const priorityOrder = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
  }

  if (sortOption === 'HIGH_TO_LOW') {
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  }

  if (sortOption === 'LOW_TO_HIGH') {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  }

  return 0
})
  const totalTasks = tasks.length

  const completedTasks = tasks.filter(
    (task) => task.status === 'COMPLETED'
  ).length
  const pendingTasks = tasks.filter(
    (task) => task.status === 'PENDING'
  ).length

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">T</div>
          <span>TaskFlow</span>
        </div>

        <p className="sidebar-heading">MENU</p>

        <nav className="sidebar-nav">
          <a href="#dashboard" className="nav-link active">
            <span>▦</span> Dashboard
          </a>

          <a href="#my-tasks" className="nav-link">
            <span>✓</span> My Tasks
          </a>

          <a href="#task-form" className="nav-link">
            <span>＋</span> Add New Task
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile">
            <div className="profile-avatar">K</div>
            <div>
              <strong>My Workspace</strong>
              <small>Personal Account</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Dashboard */}
      <main className="main-content" id="dashboard">

        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your task overview.</p>
          </div>

          <a href="#task-form" className="top-add-button">
            + Add Task
          </a>
        </header>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon total-icon">▦</div>
            <p>Total Tasks</p>
            <h2>{totalTasks}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed-icon">✓</div>
            <p>Completed Tasks</p>
            <h2>{completedTasks}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending-icon">◷</div>
            <p>Pending Tasks</p>
            <h2>{pendingTasks}</h2>
          </div>

        </section>

        {/* Task Form */}
        <section className="content-card" id="task-form">
          <div className="section-heading">
            <div>
              <h2>{editingId !== null ? 'Edit Task' : 'Create New Task'}</h2>
              <p>Enter your task details below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="task-form">

            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter task description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button" disabled={saving}>
                {saving
                  ? 'Saving...'
                  : editingId !== null
                    ? 'Update Task'
                    : 'Create Task'}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {error && <p className="error-message">{error}</p>}
        </section>

        {/* Task List */}
        <section className="content-card" id="my-tasks">
          
          <div className="search-box">
  <input
    type="text"
    placeholder="Search tasks by title..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />
</div>

<div className="filter-container">

  {/* Status Filter */}
  <select
    value={statusFilter}
    onChange={(event) => setStatusFilter(event.target.value)}
  >
    <option value="ALL">All Status</option>
    <option value="PENDING">Pending</option>
    <option value="COMPLETED">Completed</option>
  </select>

  {/* Priority Filter */}
  <select
    value={priorityFilter}
    onChange={(event) => setPriorityFilter(event.target.value)}
  >
    <option value="ALL">All Priorities</option>
    <option value="LOW">Low</option>
    <option value="MEDIUM">Medium</option>
    <option value="HIGH">High</option>
  </select>

  {/* Sorting */}
<select
  value={sortOption}
  onChange={(event) => setSortOption(event.target.value)}
>
  <option value="DEFAULT">Default Order</option>
  <option value="EARLIEST">Due Date (Earliest First)</option>
  <option value="LATEST">Due Date (Latest First)</option>
  <option value="HIGH_TO_LOW">Priority (High to Low)</option>
  <option value="LOW_TO_HIGH">Priority (Low to High)</option>
</select>

</div>
          
          <div className="section-heading">
            <div>
              <h2>My Tasks</h2>
              <p>Manage and track all your tasks.</p>
            </div>

            <span className="task-count">{totalTasks} Tasks</span>
          </div>

          {loading && <p>Loading tasks...</p>}

          {!loading && tasks.length === 0 && (
            <p className="empty-message">No tasks found. Create your first task!</p>
          )}
          

          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
  <p className="empty-message">
    No matching tasks found.
  </p>
)}

          {!loading && tasks.length > 0 && (
            <div className="task-list">
              {sortedTasks.map((task) => (
                <div className="task-item" key={task.id}>

                  <div className="task-details">
                    <h3>{task.title}</h3>

                    {task.description && (
                      <p>{task.description}</p>
                    )}

                    <div className="task-meta">
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>

                      <span className={`status-badge ${task.status.toLowerCase()}`}>
                        {task.status}
                      </span>

                      {task.dueDate && (
                        <span className="due-date">
                          Due: {task.dueDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="task-actions">

  <button
    className="status-toggle-button"
    onClick={() => handleToggleStatus(task)}
  >
    {task.status === 'COMPLETED'
      ? 'Mark as Pending'
      : 'Mark as Completed'}
  </button>

  <button
    className="edit-button"
    onClick={() => handleEdit(task)}
  >
    Edit
  </button>

  <button
    className="delete-button"
    onClick={() => handleDelete(task.id)}
  >
    Delete
  </button>

</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="footer">
          TaskFlow © 2026. Stay organized and productive.
        </footer>

      </main>
    </div>
  )
}

export default App
