"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
class TaskController {
    constructor() {
        this.getAll = async (req, res, next) => {
            try {
                const { userId } = req.user;
                const result = await this.taskService.getAllTasks(userId, req.query);
                res.status(200).json(result);
            }
            catch (error) {
                next(error);
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const { userId } = req.user;
                const id = req.params.id;
                const task = await this.taskService.getTaskById(id, userId);
                res.status(200).json(task);
            }
            catch (error) {
                next(error);
            }
        };
        this.create = async (req, res, next) => {
            try {
                const { userId } = req.user;
                const task = await this.taskService.createTask(userId, req.body);
                res.status(201).json(task);
            }
            catch (error) {
                next(error);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const { userId } = req.user;
                const id = req.params.id;
                const task = await this.taskService.updateTask(id, userId, req.body);
                res.status(200).json(task);
            }
            catch (error) {
                next(error);
            }
        };
        this.delete = async (req, res, next) => {
            try {
                const { userId } = req.user;
                const id = req.params.id;
                await this.taskService.deleteTask(id, userId);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        };
        this.toggle = async (req, res, next) => {
            try {
                const { userId } = req.user;
                const id = req.params.id;
                const task = await this.taskService.toggleTaskCompletion(id, userId);
                res.status(200).json(task);
            }
            catch (error) {
                next(error);
            }
        };
        this.taskService = new task_service_1.TaskService();
    }
}
exports.TaskController = TaskController;
