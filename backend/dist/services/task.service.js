"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const task_repository_1 = require("../repositories/task.repository");
class TaskService {
    constructor() {
        this.taskRepository = new task_repository_1.TaskRepository();
    }
    async getAllTasks(userId, query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = query.search;
        const completed = query.completed === 'true' ? true : query.completed === 'false' ? false : undefined;
        const filter = {
            userId,
            completed,
            search,
            skip,
            take: limit,
        };
        const { tasks, total } = await this.taskRepository.findAll(filter);
        return { tasks, total, page, limit };
    }
    async getTaskById(id, userId) {
        const task = await this.taskRepository.findById(id, userId);
        if (!task) {
            throw { status: 404, message: 'Task not found' };
        }
        return task;
    }
    async createTask(userId, data) {
        return this.taskRepository.create({
            ...data,
            user: { connect: { id: userId } },
        });
    }
    async updateTask(id, userId, data) {
        // Check if task exists and belongs to user
        await this.getTaskById(id, userId);
        return this.taskRepository.update(id, userId, data);
    }
    async deleteTask(id, userId) {
        // Check if task exists and belongs to user
        await this.getTaskById(id, userId);
        await this.taskRepository.delete(id, userId);
    }
    async toggleTaskCompletion(id, userId) {
        return this.taskRepository.toggleCompletion(id, userId);
    }
}
exports.TaskService = TaskService;
