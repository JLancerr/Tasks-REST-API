import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
      TasksModule, 
      UsersModule, 
      ConfigModule.forRoot({
        isGlobal: true, 
      }),
  ],
  controllers: [AppController],
  providers: [PrismaService, AppService],
  exports: [PrismaService],
})
export class AppModule {}
