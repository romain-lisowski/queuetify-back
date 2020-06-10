import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { DeleteTrackDto } from './dto/delete-track.dto';
import { Room } from 'src/rooms/interfaces/room.interface';
import { ApiHeaders } from 'src/decorators/api';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @ApiHeaders()
  @Get(':room')
  async findByRoom(@Param('room') room: Room): Promise<Track[]> {
    return this.tracksService.findByRoom(room);
  }

  @ApiHeaders()
  @Get('current/:room')
  async findCurrent(@Param('room') room: Room): Promise<Track> {
    return this.tracksService.findCurrent(room);
  }

  @ApiHeaders()
  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    this.tracksService.create(createTrackDto);
  }

  @ApiHeaders()
  @Delete()
  async delete(@Body() deleteTrackDto: DeleteTrackDto) {
    this.tracksService.delete(deleteTrackDto);
  }
}
