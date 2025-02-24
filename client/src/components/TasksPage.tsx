import React, { useEffect, useState } from 'react';

interface Task {
    id: number;
    title: string;
    description?: string;
    complete: boolean;
}

interface TasksPageProps {
    token: string;
}

const TasksPage: React.FC<TasksPageProps> = ({ token }) => {
    // Setup task properties states
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    
    // State for updating tasks
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [editingDescription, setEditingDescription] = useState('');

    // Get user's tasks
    const fetchTasks = async() => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        setTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Add a new task
    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ title, description })
        });

        // Add new task to state
        const newTask = await response.json();
        setTasks([...tasks, newTask]);
        setTitle('');
        setDescription('');
    };

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setEditingTitle(task.title);
        setEditingDescription(task.description || '');
      };
    
      // Cancel editing mode
      const cancelEditing = () => {
        setEditingTaskId(null);
        setEditingTitle('');
        setEditingDescription('');
    };

    // Change/update a task
    const updateTask = async (task: Task) => {
        const updatedData = {
            title: editingTitle,
            description: editingDescription,
            complete: task.complete
        };

        const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedData)
        });

        // Update the task with new data
        const updatedTask = await response.json();
        setTasks(tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
        cancelEditing();
    };

    // Delete a task
    const deleteTask = async (taskId: number) => {
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
      
          if (!response.ok) {
            fetchTasks()
          }
        } catch (error) {
          console.error("Error deleting task:", error)
          fetchTasks()
        }
      }

    return (
        <div>
            <h2>Your Tasks</h2>
            <form onSubmit={addTask}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    required
                />
                <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                />
                <button type="submit">Add Task</button>
            </form>
    
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {editingTaskId === task.id ? (
                            <div>
                                <input
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    placeholder="New title"
                                />
                                <input
                                    value={editingDescription}
                                    onChange={(e) => setEditingDescription(e.target.value)}
                                    placeholder="New description"
                                />
                                <button onClick={() => updateTask(task)}>Update</button>
                                <button onClick={cancelEditing}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <span
                                    style={{
                                        textDecoration: task.complete
                                            ? 'line-through'
                                            : 'none'
                                    }}
                                >
                                    {task.title} - {task.description}
                                </span>
                                <button
                                    onClick={() => startEditing(task)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TasksPage;