import { Controller, Get, Post, Body, Param, Delete, ValidationPipe } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { DeleteTrackDto } from './dto/delete-track.dto';
import { ApiHeaders } from 'src/decorators/api';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @ApiHeaders()
  @Get(':room_id')
  async findByRoomId(@Param('room_id') roomId: string): Promise<Track[]> {
    return this.tracksService.findQueueTracks(roomId);
  }

  @ApiHeaders()
  @Get('current/:room_id')
  async findCurrentByRoomId(@Param('room_id') roomId: string): Promise<Track> {
    return this.tracksService.findCurrentByRoomId(roomId);
  }

  @ApiHeaders()
  @Post()
  async create(@Body(new ValidationPipe({transform: true})) createTrackDto: CreateTrackDto) {
    this.tracksService.create(createTrackDto);
  }

  @ApiHeaders()
  @Delete()
  async delete(@Body(new ValidationPipe({transform: true})) deleteTrackDto: DeleteTrackDto) {
    this.tracksService.delete(deleteTrackDto);
  }
}
