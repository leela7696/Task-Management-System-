import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  public getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = (req as any).user;
      const result = await this.taskService.getAllTasks(userId, req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = (req as any).user;
      const id = req.params.id as string;
      const task = await this.taskService.getTaskById(id, userId);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = (req as any).user;
      const task = await this.taskService.createTask(userId, req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = (req as any).user;
      const id = req.params.id as string;
      const task = await this.taskService.updateTask(id, userId, req.body);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = (req as any).user;
      const id = req.params.id as string;
      await this.taskService.deleteTask(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  public updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = (req as any).user;
      const id = req.params.id as string;
      const { status } = req.body;
      const task = await this.taskService.updateTaskStatus(id, userId, status);
      res.status(200).json(task);
    } catch (error) {
      next(error);
    }
  };
}
