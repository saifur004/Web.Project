import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE;


function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authMode, setAuthMode] = useState('login');
  const [authData, setAuthData] = useState({ email: '', password: '' });
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });

  const handleAuth = async () => {
    try {
      const url = `${API_BASE}/auth/${authMode}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData)
      });

      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        setTasks(data);
      } else {
        console.warn('Unexpected task data:', data);
        setTasks([]);
      }
    } catch (error) {
      console.error('Fetch tasks error:', error);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const addTask = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newTask)
      });

      if (res.ok) {
        setNewTask({ title: '', description: '', due_date: '' });
        fetchTasks();
      } else {
        const errData = await res.json();
        console.warn('Add task failed:', errData);
      }
    } catch (error) {
      console.error('Add task error:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        fetchTasks();
      } else {
        const errData = await res.json();
        console.warn('Delete task failed:', errData);
      }
    } catch (error) {
      console.error('Delete task error:', error);
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  if (!token) {
    return (
      <div className="container auth-box">
        <h1 className="app-title">My ToDo List</h1>
        <h2 className="auth-heading">{authMode === 'login' ? 'Login' : 'Register'}</h2>

        <input
          type="email"
          placeholder="Email"
          value={authData.email}
          onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={authData.password}
          onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
        />
        <button onClick={handleAuth} className="btn btn-auth">
          {authMode === 'login' ? 'Login' : 'Register'}
        </button>

        <p>
          {authMode === 'login' ? 'No account?' : 'Already registered?'}{' '}
          <button
            className="btn-link"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            Switch to {authMode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="todo-box">
        <div className="header">
          <h1>My ToDo List</h1>
          <button className="btn btn-logout" onClick={logout}>
            Logout
          </button>
        </div>

        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        <input
          type="date"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
        />
        <button className="btn btn-add" onClick={addTask}>
          Add Task
        </button>

        {Array.isArray(tasks) && tasks.map((task) => (
          <div className="task" key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <small>Due: {new Date(task.due_date).toLocaleDateString()}</small>
            <button className="btn btn-delete" onClick={() => deleteTask(task.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
