import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [UsersModule], 
  controllers: [TasksController],
  providers: [TasksService, PrismaService],
})
export class TasksModule {}