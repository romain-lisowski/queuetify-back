import { Controller, Get } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Room } from './interfaces/room.interface';
import { ApiHeaders } from 'src/decorators/api';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiHeaders()
  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomsService.findAll();
  }
}
