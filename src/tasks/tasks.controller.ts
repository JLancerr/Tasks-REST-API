import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';
import * as express from 'express';

@UseGuards(AuthGuard) 
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() req: express.Request): Promise<Task[]> {
    const userId = req['user'].sub;
    return this.tasksService.findAll(userId);
  }

  @Get('all-done')
  findAllCompleted(@Req() req: express.Request): Promise<Task[]> {
    const userId = req['user'].sub;
    return this.tasksService.findAllCompleted(userId);
  }

  @Get('all-not-done')
  findAllNotCompleted(@Req() req: express.Request): Promise<Task[]> {
    const userId = req['user'].sub;
    return this.tasksService.findAllNotCompleted(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.findOne(id, userId);
  }

  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.create(userId, createTaskDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.update(id, userId, updateTaskDto);
  }

  @Patch(':id/toggle-done')
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.complete(id, userId);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.remove(id, userId);
  }
}