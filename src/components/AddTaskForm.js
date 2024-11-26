import React, { useState } from 'react';

const AddTaskForm = ({ onAddTask }) => {
    const [newTaskText, setNewTaskText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) return;
        onAddTask(newTaskText);
        setNewTaskText('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
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
    );
};

export default AddTaskForm;