import { useState, useEffect } from 'react';
import { todoApi } from '../api/todoApi';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

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

  const handleRenameTask = async (taskId, newText) => {
    try {
      setError(null);
      setLoadingStates(prev => ({ ...prev, [taskId]: true }));

      const updatedTask = await todoApi.updateTask(taskId, newText);
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStates(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const handleCompleteAll = async () => {
    try {
      setBulkActionLoading(true);
      setError(null);

      const visibleTasks = getFilteredTasks();
      const incompleteTasks = visibleTasks.filter(task => !task.completed);

      for (const task of incompleteTasks) {
        const updatedTask = await todoApi.completeTask(task.id);
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleClearCompleted = async () => {
    try {
      setBulkActionLoading(true);
      setError(null);

      const completedTasks = tasks.filter(task => task.completed);

      for (const task of completedTasks) {
        await todoApi.deleteTask(task.id);
      }

      setTasks(tasks.filter(task => !task.completed));
    } catch (err) {
      setError(err.message);
    } finally {
      setBulkActionLoading(false);
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="btn-group" role="group" aria-label="Filter tasks">
          <button
            type="button"
            className={`btn btn-outline-secondary ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            type="button"
            className={`btn btn-outline-secondary ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {tasks.length > 0 && (
          <div className="d-flex gap-2">
            <button
              onClick={handleCompleteAll}
              disabled={bulkActionLoading || getFilteredTasks().every(task => task.completed)}
              className="btn btn-outline-success"
            >
              {bulkActionLoading ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              ) : null}
              Complete All Visible
            </button>
            <button
              onClick={handleClearCompleted}
              disabled={bulkActionLoading || completedCount === 0}
              className="btn btn-outline-danger"
            >
              {bulkActionLoading ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              ) : null}
              Clear Completed
            </button>
          </div>
        )}

        <div className="text-muted">
          {completedCount} of {totalCount} completed
        </div>
      </div>

      <ul className="list-group">
        {getFilteredTasks().map(task => (
          <TodoItem
            key={task.id}
            task={task}
            isLoading={loadingStates[task.id] || bulkActionLoading}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onRename={handleRenameTask}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;