"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class TaskRepository {
    constructor() {
        this.prisma = prisma_1.default;
    }
    async findAll(filter) {
        const { userId, completed, search, skip = 0, take = 10 } = filter;
        const where = {
            userId,
        };
        if (completed !== undefined) {
            where.completed = completed;
        }
        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive',
            };
        }
        const [tasks, total] = await Promise.all([
            this.prisma.task.findMany({
                where,
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.task.count({ where }),
        ]);
        return { tasks, total };
    }
    async findById(id, userId) {
        return this.prisma.task.findFirst({
            where: { id, userId },
        });
    }
    async create(data) {
        return this.prisma.task.create({ data });
    }
    async update(id, userId, data) {
        return this.prisma.task.update({
            where: { id, userId },
            data,
        });
    }
    async delete(id, userId) {
        return this.prisma.task.delete({
            where: { id, userId },
        });
    }
    async toggleCompletion(id, userId) {
        const task = await this.findById(id, userId);
        if (!task) {
            throw { status: 404, message: 'Task not found' };
        }
        return this.prisma.task.update({
            where: { id, userId },
            data: { completed: !task.completed },
        });
    }
}
exports.TaskRepository = TaskRepository;
