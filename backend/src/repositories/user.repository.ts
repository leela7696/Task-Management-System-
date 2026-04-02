import { PrismaClient, User } from '@prisma/client';
import prisma from '../config/prisma';

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  public async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async create(data: any): Promise<User> {
    return this.prisma.user.create({ data });
  }

  public async updateRefreshToken(userId: string, refreshToken: string | null): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
