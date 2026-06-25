import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from '../prisma/prisma.service.ts';

@Module({
  imports: [TasksModule],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
