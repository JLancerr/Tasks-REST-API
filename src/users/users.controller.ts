import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  Req
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'; 
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @Post('create')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Post('authenticate')
    authenticate(@Body() authenticateUserDto: AuthenticateUserDto) {
        return this.usersService.authenticate(authenticateUserDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Patch('profile') 
    update(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
        const userId = req['user'].sub; 
        return this.usersService.update(userId, updateUserDto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Delete('profile') 
    remove(@Req() req: Request) {
        const userId = req['user'].sub;
        return this.usersService.remove(userId);
    }
}