import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todoApi } from '../../api/todoApi';

// Async thunks
export const fetchTasks = createAsyncThunk(
    'todos/fetchTasks',
    async () => await todoApi.getAllTasks()
);

export const addTask = createAsyncThunk(
    'todos/addTask',
    async (text) => await todoApi.createTask(text)
);

export const toggleTask = createAsyncThunk(
    'todos/toggleTask',
    async ({ taskId, isCompleted }) => {
        if (isCompleted) {
            return await todoApi.incompleteTask(taskId);
        }
        return await todoApi.completeTask(taskId);
    }
);

export const deleteTask = createAsyncThunk(
    'todos/deleteTask',
    async (taskId) => {
        await todoApi.deleteTask(taskId);
        return taskId;
    }
);

export const updateTask = createAsyncThunk(
    'todos/updateTask',
    async ({ taskId, text }) => await todoApi.updateTask(taskId, text)
);

export const completeAllTasks = createAsyncThunk(
    'todos/completeAllTasks',
    async (tasks) => {
        const promises = tasks
            .filter(task => !task.completed)
            .map(task => todoApi.completeTask(task.id));
        return await Promise.all(promises);
    }
);

export const clearCompletedTasks = createAsyncThunk(
    'todos/clearCompletedTasks',
    async (tasks) => {
        const completedTaskIds = tasks
            .filter(task => task.completed)
            .map(task => task.id);

        await Promise.all(
            completedTaskIds.map(id => todoApi.deleteTask(id))
        );

        return completedTaskIds;
    }
);

const initialState = {
    tasks: [],
    loading: false,
    error: null,
    loadingStates: {},
    filter: 'all',
    bulkActionLoading: false
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add task
            .addCase(addTask.pending, (state) => {
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.tasks.unshift(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // Toggle task
            .addCase(toggleTask.pending, (state, action) => {
                const { taskId } = action.meta.arg;
                state.loadingStates[taskId] = true;
                state.error = null;
            })
            .addCase(toggleTask.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                state.loadingStates[updatedTask.id] = false;
                const index = state.tasks.findIndex(task => task.id === updatedTask.id);
                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }
            })
            .addCase(toggleTask.rejected, (state, action) => {
                const { taskId } = action.meta.arg;
                state.loadingStates[taskId] = false;
                state.error = action.error.message;
            })

            // Delete task
            .addCase(deleteTask.pending, (state, action) => {
                state.loadingStates[action.meta.arg] = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const taskId = action.payload;
                state.loadingStates[taskId] = false;
                state.tasks = state.tasks.filter(task => task.id !== taskId);
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loadingStates[action.meta.arg] = false;
                state.error = action.error.message;
            })

            // Update task
            .addCase(updateTask.pending, (state, action) => {
                const { taskId } = action.meta.arg;
                state.loadingStates[taskId] = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const updatedTask = action.payload;
                state.loadingStates[updatedTask.id] = false;
                const index = state.tasks.findIndex(task => task.id === updatedTask.id);
                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                const { taskId } = action.meta.arg;
                state.loadingStates[taskId] = false;
                state.error = action.error.message;
            })

            // Complete all tasks
            .addCase(completeAllTasks.pending, (state) => {
                state.bulkActionLoading = true;
                state.error = null;
            })
            .addCase(completeAllTasks.fulfilled, (state, action) => {
                state.bulkActionLoading = false;
                action.payload.forEach(updatedTask => {
                    const index = state.tasks.findIndex(task => task.id === updatedTask.id);
                    if (index !== -1) {
                        state.tasks[index] = updatedTask;
                    }
                });
            })
            .addCase(completeAllTasks.rejected, (state, action) => {
                state.bulkActionLoading = false;
                state.error = action.error.message;
            })

            // Clear completed tasks
            .addCase(clearCompletedTasks.pending, (state) => {
                state.bulkActionLoading = true;
                state.error = null;
            })
            .addCase(clearCompletedTasks.fulfilled, (state, action) => {
                state.bulkActionLoading = false;
                const deletedIds = action.payload;
                state.tasks = state.tasks.filter(task => !deletedIds.includes(task.id));
            })
            .addCase(clearCompletedTasks.rejected, (state, action) => {
                state.bulkActionLoading = false;
                state.error = action.error.message;
            });
    }
});

export const { setFilter, clearError } = todoSlice.actions;
export default todoSlice.reducer;