import { Injectable, NotFoundException, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthenticateUserDto } from './dto/authenticate-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService, 
    private readonly jwtService: JwtService,
  ) {}
   
	async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException("Email already taken");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword
      }
    });

    const { password, ...result } = newUser;
    return result;
  }

  async authenticate(authenticateUserDto: AuthenticateUserDto) {
    const user = await this.findOneByEmail(authenticateUserDto.email);
  
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(authenticateUserDto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email
      }
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);
    const dataToUpdate: any = {};

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailConflict = await this.prisma.user.findFirst({
        where: {
          email: updateUserDto.email,
          id: { not: id } 
        }
      });
      if (emailConflict) {
        throw new ConflictException("Email already taken");
      }
      dataToUpdate.email = updateUserDto.email;
    }
		
    if (updateUserDto.name) {
      dataToUpdate.name = updateUserDto.name;
    }

    if (updateUserDto.newPassword) {
      if (!updateUserDto.oldPassword) {
        throw new BadRequestException("Current password is required to set a new password");
      }

      const passwordMatches = await bcrypt.compare(updateUserDto.oldPassword, user.password);
      if (!passwordMatches) {
        throw new UnauthorizedException("Incorrect current password");
      }

      const salt = await bcrypt.genSalt(10);
      dataToUpdate.password = await bcrypt.hash(updateUserDto.newPassword, salt);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new BadRequestException("No valid fields provided for update");
    }

		const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate
    });

    const { password, ...result } = updatedUser;
    return result;
  } 

  async remove(id: number): Promise<{ message: string }> {
    await this.findOneById(id); 
    
    await this.prisma.user.delete({
      where: { id }
    });

    return { message: "User profile successfully deleted" };
  }
}