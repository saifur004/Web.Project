import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ToDoPage() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:5000/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Unauthorized or failed to fetch tasks');
        }
        return res.json();
      })
      .then(data => {
        setTasks(data);
      })
      .catch(err => {
        console.error(err);
        navigate('/login'); // optional fallback
      });
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul>
          {tasks.map(task => (
            <li key={task.id} style={{ marginBottom: '1rem' }}>
              <strong>{task.title}</strong><br />
              {task.description}<br />
              <small>Due: {new Date(task.due_date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ToDoPage;
