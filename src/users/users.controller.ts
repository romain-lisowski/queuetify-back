import { Controller, Get, Post, Body, Param, Delete, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ApiHeaders } from 'src/decorators/api';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiHeaders()
  @Get(':room_id')
  async findByRoomId(@Param('room_id') roomId: string): Promise<User[]> {
    return this.usersService.findByRoomId(roomId);
  }

  @ApiHeaders()
  @Post()
  async create(@Body(new ValidationPipe({transform: true})) createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }

  @ApiHeaders()
  @Delete()
  async delete(@Body(new ValidationPipe({transform: true})) deleteUserDto: DeleteUserDto) {
    this.usersService.delete(deleteUserDto);
  }
}
