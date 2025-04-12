const express = require('express');
const router = express.Router();
const db = require('../db/db');
const jwt = require('jsonwebtoken');

// 🔐 Middleware to verify token and extract user ID
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, 'my_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// 🟢 GET tasks for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 🔵 POST a new task
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, due_date } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      'INSERT INTO tasks (title, description, due_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, due_date, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 🟡 PUT (update) a task only if it belongs to the user
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, completed } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `UPDATE tasks 
       SET title = $1, description = $2, due_date = $3, completed = $4 
       WHERE id = $5 AND user_id = $6 
       RETURNING *`,
      [title, description, due_date, completed, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Unauthorized or task not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 🔴 DELETE a task only if it belongs to the user
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await db.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: 'Unauthorized or task not found' });
    }

    res.json({ message: 'Task deleted', task: result.rows[0] });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
