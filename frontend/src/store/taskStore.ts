import { create } from 'zustand';
import { Task, PaginatedTasks, TaskStatus, Priority } from '../types';
import api from '../lib/api';

interface TaskState {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  search: string;
  status: TaskStatus | undefined;
  priority: Priority | undefined;
  fetchTasks: (query?: any) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  setSearch: (search: string) => void;
  setStatus: (status: TaskStatus | undefined) => void;
  setPriority: (priority: Priority | undefined) => void;
  setPage: (page: number) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  total: 0,
  page: 1,
  limit: 10,
  isLoading: false,
  search: '',
  status: undefined,
  priority: undefined,

  fetchTasks: async (query = {}) => {
    set({ isLoading: true });
    try {
      const { page, search, status, priority, limit } = get();
      const params = {
        page: query.page || page,
        limit: query.limit || limit,
        search: query.search !== undefined ? query.search : search,
        status: query.status !== undefined ? query.status : status,
        priority: query.priority !== undefined ? query.priority : priority,
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

  updateTaskStatus: async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      await get().fetchTasks();
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchTasks({ search, page: 1 });
  },

  setStatus: (status) => {
    set({ status, page: 1 });
    get().fetchTasks({ status, page: 1 });
  },

  setPriority: (priority) => {
    set({ priority, page: 1 });
    get().fetchTasks({ priority, page: 1 });
  },

  setPage: (page) => {
    set({ page });
    get().fetchTasks({ page });
  },
}));
