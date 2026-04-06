import { TaskRepository, TaskFilter } from '../repositories/task.repository';
import { Task } from '@prisma/client';
import { TaskStatus, Priority } from '../types/enums';
import { NotFoundError } from '../utils/errors';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  public async getAllTasks(userId: string, query: any): Promise<{ tasks: Task[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page as string) || 1;
    const limit = Math.min(parseInt(query.limit as string) || 10, 100);
    const skip = (page - 1) * limit;
    const search = query.search as string;
    const status = query.status as TaskStatus;
    const priority = query.priority as Priority;

    const filter: TaskFilter = {
      userId,
      status,
      priority,
      search,
      skip,
      take: limit,
    };

    const { tasks, total } = await this.taskRepository.findAll(filter);

    return { tasks, total, page, limit };
  }

  public async getTaskById(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findById(id, userId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return task;
  }

  public async createTask(userId: string, data: any): Promise<Task> {
    const { title, description, status, priority, dueDate } = data;
    return this.taskRepository.create({
      title,
      description,
      status: status || TaskStatus.PENDING,
      priority: priority || Priority.MEDIUM,
      dueDate: dueDate ? new Date(dueDate) : null,
      user: { connect: { id: userId } },
    });
  }

  public async updateTask(id: string, userId: string, data: any): Promise<Task> {
    // Check if task exists and belongs to user
    await this.getTaskById(id, userId);
    
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
    }

    return this.taskRepository.update(id, userId, data);
  }

  public async deleteTask(id: string, userId: string): Promise<void> {
    // Check if task exists and belongs to user
    await this.getTaskById(id, userId);
    await this.taskRepository.delete(id, userId);
  }

  public async updateTaskStatus(id: string, userId: string, status: TaskStatus): Promise<Task> {
    // Check if task exists and belongs to user
    await this.getTaskById(id, userId);
    return this.taskRepository.updateStatus(id, userId, status);
  }
}
