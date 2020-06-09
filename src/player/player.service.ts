import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TracksService } from 'src/tracks/tracks.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/interfaces/room.interface';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class PlayerService {
  @WebSocketServer()
  io: Server;

  constructor(
    private readonly roomsService: RoomsService,
    private readonly tracksService: TracksService,
  ) {}

  async run() {
    const rooms: Room[] = await this.roomsService.findAll();

    for (const room of rooms) {
      if (room.current === undefined || room.current === null) {
        room.current = await this.tracksService.findCurrentOrNext(room);
        if (room.current) {
          this.io.to(room.name).emit('REFRESH_CURRENT_TRACK');
          this.io.to(room.name).emit('REFRESH_TRACKS');
        }
      } else {
        // next track if current_track end
        const endTrackDate = DateTime.fromSeconds(
          room.current.played_at.seconds + room.current.duration / 1000,
        );
        const now = DateTime.local().setZone('utc');
        if (now >= endTrackDate) {
          room.current = null;
          this.io.to(room.name).emit('REFRESH_CURRENT_TRACK');
          this.io.to(room.name).emit('REFRESH_TRACKS');
        }
      }
      setTimeout(this.run, 2000);
    }
  }
}
