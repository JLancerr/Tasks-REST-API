import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId }, 
      orderBy: { id: 'asc' },
    });
  }

  findAllCompleted(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
        completed: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  findAllNotCompleted(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
        completed: false,
      },
      orderBy: { id: 'asc' },
    });
  }

  // Double-checks task ownership concurrently
  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId, 
      },
    });
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id, userId); 
    
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async complete(id: number, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
      },
    });
  }

  async remove(id: number, userId: number): Promise<Task> {
    await this.findOne(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}