import { Controller, Get, Param, ValidationPipe, Body, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './interfaces/room.interface';
import { ApiHeaders } from 'src/decorators/api';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiHeaders()
  @Get()
  async findPublicRooms(): Promise<Room[]> {
    return this.roomsService.findPublic();
  }

  @ApiHeaders()
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<Room> {
    return this.roomsService.findOneById(id);
  }

  @ApiHeaders()
  @Post('user')
  async findOneOrCreateRoom(@Body(new ValidationPipe({transform: true})) createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomsService.findOneOrCreateRoom(createRoomDto);
  }
}
