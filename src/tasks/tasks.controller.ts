import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Get('all-done')
  findAllCompleted(): Task[] {
    return this.tasksService.findAllCompleted();
  }

  @Get('all-not-done')
  findAllNotCompleted(): Task[] {
    return this.tasksService.findAllNotCompleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Task {
    return this.tasksService.findOne(Number(id));
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Task {
    return this.tasksService.update(Number(id), updateTaskDto);
  }

  @Patch(':id/toggle-done')
  complete(@Param('id') id: string): Task {
    return this.tasksService.complete(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string): Task {
    return this.tasksService.remove(Number(id));
  }
}
