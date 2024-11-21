import React from 'react';

const TodoItem = ({ task, isLoading, onToggleComplete, onDelete }) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <div className="form-check">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id, task.completed)}
            disabled={isLoading}
            className="form-check-input"
            id={`task-${task.id}`}
          />
          <label 
            className={`form-check-label ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}
            htmlFor={`task-${task.id}`}
          >
            {task.text}
            {isLoading && (
              <small className="ms-2 text-muted fst-italic">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
              </small>
            )}
          </label>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        disabled={isLoading}
        className="btn btn-danger btn-sm"
        aria-label="Delete task"
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;