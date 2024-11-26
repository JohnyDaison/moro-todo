import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TodoItem from './TodoItem';
import AddTaskForm from './AddTaskForm';
import TodoToolbar from './TodoToolbar';
import AlertMessage from './AlertMessage';
import {
    fetchTasks,
    addTask,
    toggleTask,
    deleteTask,
    updateTask,
    completeAllTasks,
    clearCompletedTasks,
    setFilter,
    clearError,
} from '../store/slices/todoSlice';

const TodoList = () => {
    const dispatch = useDispatch();
    const {
        tasks,
        loading,
        error,
        loadingStates,
        filter,
        bulkActionLoading
    } = useSelector(state => state.todos);

    useEffect(() => {
        dispatch(fetchTasks());
    }, [dispatch]);

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
    const filteredTasks = getFilteredTasks();

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
            <AlertMessage message={error} onDismiss={() => dispatch(clearError())} />

            <AddTaskForm
                onAddTask={(text) => dispatch(addTask(text))}
            />

            <TodoToolbar
                filter={filter}
                onFilterChange={(newFilter) => dispatch(setFilter(newFilter))}
                onCompleteAll={() => dispatch(completeAllTasks(filteredTasks))}
                onClearCompleted={() => dispatch(clearCompletedTasks(tasks))}
                completedCount={completedCount}
                totalCount={tasks.length}
                allVisibleCompleted={filteredTasks.every(task => task.completed)}
                isLoading={bulkActionLoading}
            />

            <ul className="list-group">
                {filteredTasks.map(task => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        isLoading={loadingStates[task.id] || bulkActionLoading}
                        onToggleComplete={(taskId, isCompleted) =>
                            dispatch(toggleTask({ taskId, isCompleted }))}
                        onDelete={(taskId) => dispatch(deleteTask(taskId))}
                        onRename={(taskId, text) =>
                            dispatch(updateTask({ taskId, text }))}
                    />
                ))}
            </ul>
        </div>
    );
};

export default TodoList;