import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Room } from 'src/rooms/interfaces/room.interface';
import { ApiHeaders } from 'src/decorators/api';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiHeaders()
  @Get(':room')
  async findByRoom(@Param('room') room: Room): Promise<User[]> {
    return this.usersService.findByRoom(room);
  }

  @ApiHeaders()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.usersService.create(createUserDto);
  }

  @ApiHeaders()
  @Delete()
  async delete(@Body() deleteUserDto: DeleteUserDto) {
    this.usersService.delete(deleteUserDto);
  }
}
