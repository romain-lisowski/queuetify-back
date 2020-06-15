import { Controller, Get, Param, Post, Body, ValidationPipe, Delete } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './interfaces/room.interface';
import { ApiHeaders } from 'src/decorators/api';
import { CreateRoomDto } from './dto/create-room.dto';
import { DeleteRoomDto } from './dto/delete-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiHeaders()
  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }

  @ApiHeaders()
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Room> {
    return this.roomsService.findOneById(id);
  }

  @ApiHeaders()
  @Post()
  async create(@Body(new ValidationPipe({transform: true})) createRoomDto: CreateRoomDto) {
    this.roomsService.create(createRoomDto);
  }

  @ApiHeaders()
  @Delete()
  async delete(@Body(new ValidationPipe({transform: true})) deleteRoomDto: DeleteRoomDto) {
    this.roomsService.delete(deleteRoomDto);
  }
}
