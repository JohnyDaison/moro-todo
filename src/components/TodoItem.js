import React, { useState } from 'react';

const TodoItem = ({ task, isLoading, onToggleComplete, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    if (editText.trim() && editText !== task.text) {
      onRename(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleStartEditing = () => {
    setEditText(task.text);
    setIsEditing(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  return (
    <li className="list-group-item">
      <div className="d-flex align-items-center">
        <div className="d-flex align-items-center flex-grow-1">
          <div className="form-check">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id, task.completed)}
              disabled={isLoading}
              className="form-check-input"
              id={`task-${task.id}`}
            />
            {isEditing ? (
              <form onSubmit={handleRenameSubmit} className="ms-2 flex-grow-1">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="form-control form-control-sm"
                  autoFocus
                  onBlur={handleRenameSubmit}
                />
              </form>
            ) : (
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
            )}
          </div>
        </div>
        <div className="btn-group">
          <button
            onClick={handleStartEditing}
            disabled={isLoading}
            className="btn btn-outline-secondary btn-sm"
            aria-label="Rename task"
          >
            Rename
          </button>
          <button
            onClick={() => onDelete(task.id)}
            disabled={isLoading}
            className="btn btn-danger btn-sm"
            aria-label="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="ps-4 small text-muted">
        <div>Created: {formatDate(task.createdDate)}</div>
        {task.completed && <div>Completed: {formatDate(task.completedDate)}</div>}
      </div>
    </li>
  );
};

export default TodoItem;