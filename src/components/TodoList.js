import { useState, useEffect } from 'react';
import { todoApi } from '../api/todoApi';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await todoApi.getAllTasks();
      setTasks(tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      setError(null);
      const newTask = await todoApi.createTask(newTaskText);
      setTasks([newTask, ...tasks]);
      setNewTaskText('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleComplete = async (taskId, isCompleted) => {
    try {
      setError(null);
      setLoadingStates(prev => ({ ...prev, [taskId]: true }));
      
      const updatedTask = isCompleted
        ? await todoApi.incompleteTask(taskId)
        : await todoApi.completeTask(taskId);
      
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setError(null);
      setLoadingStates(prev => ({ ...prev, [taskId]: true }));
      
      await todoApi.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [taskId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center text-muted">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          />
        </div>
      )}

      <form onSubmit={handleAddTask} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task"
            className="form-control"
          />
          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
        </div>
      </form>

      <ul className="list-group">
        {tasks.map(task => (
          <TodoItem
            key={task.id}
            task={task}
            isLoading={loadingStates[task.id]}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;