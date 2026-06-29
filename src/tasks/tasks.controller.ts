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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; 
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';
import * as express from 'express';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  @Get()
  findAll(@Req() req: express.Request): Promise<Task[]> {
    const userId = req['user'].sub;
    return this.tasksService.findAll(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  @Get('all-done')
  findAllCompleted(@Req() req: express.Request): Promise<Task[]> {
    const userId = req['user'].sub;
    return this.tasksService.findAllCompleted(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  @Get('all-not-done')
  findAllNotCompleted(@Req() req: express.Request): Promise<Task[]> {
    const userId = req['user'].sub;
    return this.tasksService.findAllNotCompleted(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.findOne(id, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.create(userId, createTaskDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.update(id, userId, updateTaskDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  @Patch(':id/toggle-done')
  complete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.complete(id, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard) 
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
  ): Promise<Task> {
    const userId = req['user'].sub;
    return this.tasksService.remove(id, userId);
  }
}