import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  findAll(): Task[] {
    return this.tasks;
  }

  findAllCompleted() {
    return this.tasks.filter((task) => task.completed === true);
  }

  findAllNotCompleted() {
    return this.tasks.filter((task) => task.completed === false);
  }

  findOne(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: this.nextId,
      title: createTaskDto.title,
      description: createTaskDto.description,
      completed: false,
    };

    this.nextId += 1;
    this.tasks.push(task);

    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    Object.assign(task, updateTaskDto);

    return task;
  }

  complete(id: number): Task {
    const task = this.findOne(id);

    task.completed = !task.completed;

    return task;
  }

  remove(id: number): Task {
    const task = this.findOne(id);

    this.tasks = this.tasks.filter((task) => task.id !== id);

    return task;
  }
}
