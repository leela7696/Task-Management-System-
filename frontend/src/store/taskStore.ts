import { create } from 'zustand';
import { Task, PaginatedTasks } from '../types';
import api from '../lib/api';

interface TaskState {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  search: string;
  completed: boolean | undefined;
  fetchTasks: (query?: any) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  setSearch: (search: string) => void;
  setCompleted: (completed: boolean | undefined) => void;
  setPage: (page: number) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  search: '',
  completed: undefined,

  fetchTasks: async (query = {}) => {
    set({ isLoading: true });
    try {
      const { page, search, completed, limit } = get();
      const params = {
        page: query.page || page,
        limit: query.limit || limit,
        search: query.search !== undefined ? query.search : search,
        completed: query.completed !== undefined ? query.completed : completed,
      };

      const response = await api.get<PaginatedTasks>('/tasks', { params });
      set({
        tasks: response.data.tasks,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
      });
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createTask: async (data) => {
    try {
      await api.post('/tasks', data);
      await get().fetchTasks();
    } catch (error) {
      console.error('Failed to create task', error);
    }
  },

  updateTask: async (id, data) => {
    try {
      await api.patch(`/tasks/${id}`, data);
      await get().fetchTasks();
    } catch (error) {
      console.error('Failed to update task', error);
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      await get().fetchTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  },

  toggleTask: async (id) => {
    try {
      await api.patch(`/tasks/${id}/toggle`);
      await get().fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task', error);
    }
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchTasks({ search, page: 1 });
  },

  setCompleted: (completed) => {
    set({ completed, page: 1 });
    get().fetchTasks({ completed, page: 1 });
  },

  setPage: (page) => {
    set({ page });
    get().fetchTasks({ page });
  },
}));
