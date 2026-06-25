import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get('all-done')
  findAllCompleted(): Promise<Task[]> {
    return this.tasksService.findAllCompleted();
  }

  @Get('all-not-done')
  findAllNotCompleted(): Promise<Task[]> {
    return this.tasksService.findAllNotCompleted();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Patch(':id/toggle-done')
  complete(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.complete(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.remove(id);
  }
}
