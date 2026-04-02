import { PrismaClient, Task, Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export interface TaskFilter {
  userId: string;
  completed?: boolean;
  search?: string;
  skip?: number;
  take?: number;
}

export class TaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  public async findAll(filter: TaskFilter): Promise<{ tasks: Task[]; total: number }> {
    const { userId, completed, search, skip = 0, take = 10 } = filter;

    const where: Prisma.TaskWhereInput = {
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

  public async findById(id: string, userId: string): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: { id, userId },
    });
  }

  public async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  public async update(id: string, userId: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return this.prisma.task.update({
      where: { id, userId },
      data,
    });
  }

  public async delete(id: string, userId: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id, userId },
    });
  }

  public async toggleCompletion(id: string, userId: string): Promise<Task> {
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
