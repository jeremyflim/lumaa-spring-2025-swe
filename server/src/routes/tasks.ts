import { Router, Response } from 'express';
import pool from '../db';
import { authenticateToken } from '../middleware/authMiddleware';
import ERRORS from '../errors';
import { AuthReq } from '../types/types'

const router = Router();

router.use(authenticateToken);

// Get user tasks
router.get('/', async (req : AuthReq, res: Response) => {
    const userId = req.user?.userId;

    try {
        // Get tasks belonging to user by their userId from database
        const result = await pool.query(
            'SELECT * FROM tasks WHERE userid = $1', [userId]
        );
        res.json(result.rows);

    } catch (err) {
        res.status(500).json({ error: ERRORS.TASK_FETCH_FAILED });
    }
});

// Create new task
router.post('/', async (req : AuthReq, res: Response) => {
    const { title, description } = req.body;
    const userId = req.user?.userId;
    
    try {
        const result = await pool.query(
            'INSERT INTO tasks (title, description, userid) VALUES ($1, $2, $3) RETURNING *',
            [title, description, userId]
        );
        res.status(201).json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: ERRORS.TASK_CREATE_FAILED });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    const { title, description, complete } = req.body;
    const taskId = req.params.id;
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, complete = $3 WHERE id = $4 RETURNING *',
            [title, description, complete, taskId]
        );
        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).json({ error: ERRORS.TASK_UPDATE_FAILED });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    const taskId = req.params.id;

    try {
        await pool.query(
            'DELETE FROM tasks WHERE id = $1', [taskId]
        );
        res.status(200);

    } catch (err) {
        res.status(500).json({ error: ERRORS.TASK_DELETE_FAILED });
    }
});

export default router;