import { TaskRepository, TaskFilter } from '../repositories/task.repository';
import { Task } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

export class TaskService {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  public async getAllTasks(userId: string, query: any): Promise<{ tasks: Task[]; total: number; page: number; limit: number }> {
    const page = parseInt(query.page as string) || 1;
    const limit = Math.min(parseInt(query.limit as string) || 10, 100); // Prevent potential DoS via large limits
    const skip = (page - 1) * limit;
    const search = query.search as string;
    const completed = query.completed === 'true' ? true : query.completed === 'false' ? false : undefined;

    const filter: TaskFilter = {
      userId,
      completed,
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
    return this.taskRepository.create({
      ...data,
      user: { connect: { id: userId } },
    });
  }

  public async updateTask(id: string, userId: string, data: any): Promise<Task> {
    // Check if task exists and belongs to user
    await this.getTaskById(id, userId);
    return this.taskRepository.update(id, userId, data);
  }

  public async deleteTask(id: string, userId: string): Promise<void> {
    // Check if task exists and belongs to user
    await this.getTaskById(id, userId);
    await this.taskRepository.delete(id, userId);
  }

  public async toggleTaskCompletion(id: string, userId: string): Promise<Task> {
    return this.taskRepository.toggleCompletion(id, userId);
  }
}
