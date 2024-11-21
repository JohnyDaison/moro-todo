import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error(error.response.data || 'Invalid request');
        case 404:
          throw new Error('Item not found');
        case 422:
          throw new Error(error.response.data || 'Validation error');
        case 500:
          throw new Error('Server error - please try again later');
        default:
          throw new Error('An error occurred');
      }
    } else if (error.request) {
      throw new Error('No response from server - please check your connection');
    } else {
      throw new Error('Failed to make request');
    }
  }
);

export const todoApi = {
  getAllTasks: () => api.get('/tasks'),

  getCompletedTasks: () => api.get('/tasks/completed'),

  createTask: (text) => api.post('/tasks', { text }),

  updateTask: (id, text) => api.post(`/tasks/${id}`, { text }),

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    return true;
  },

  completeTask: (id) => api.post(`/tasks/${id}/complete`),

  incompleteTask: (id) => api.post(`/tasks/${id}/incomplete`),
};