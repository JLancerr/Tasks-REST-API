import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  findAllCompleted(): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        completed: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  findAllNotCompleted(): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        completed: false,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.findOne(id);

    return this.prisma.task.update({
      where: {
        id,
      },
      data: updateTaskDto,
    });
  }

  async complete(id: number): Promise<Task> {
    const task = await this.findOne(id);

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        completed: !task.completed,
      },
    });
  }

  async remove(id: number): Promise<Task> {
    await this.findOne(id);

    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
