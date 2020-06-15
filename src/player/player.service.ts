import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { TracksService } from 'src/tracks/tracks.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/interfaces/room.interface';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Cron } from '@nestjs/schedule';

@WebSocketGateway()
@Injectable()
export class PlayerService {
  @WebSocketServer()
  io: Server;

  private rooms: Room[];

  constructor(
    private readonly roomsService: RoomsService,
    private readonly tracksService: TracksService,
  ) {}

  @Cron('*/2 * * * * *')
  async run() {
    if (!this.rooms || this.rooms.length === 0) {
      this.rooms = await this.roomsService.findAll();
    } else {
      for (const room of this.rooms) {
        if (room.current === undefined || room.current === null) {
          // get next track if exists
          room.current = await this.tracksService.findCurrentOrNext(room);

          // new track played
          if (room.current) {
            this.io.to(room.id).emit('REFRESH_CURRENT_TRACK');
            this.io.to(room.id).emit('REFRESH_TRACKS');
          }
        } else {
          const now = DateTime.local().setZone('utc');
          if (room.current.played_at) {
            const endTrackDate = DateTime.fromSeconds(
              room.current.played_at.seconds + room.current.duration / 1000,
            );
            
            // clear current for next track if current ends
            if (now >= endTrackDate) {
              room.current = null;
              this.io.to(room.id).emit('REFRESH_CURRENT_TRACK');
              this.io.to(room.id).emit('REFRESH_TRACKS');
            }
          }
        }
      }
    }
  }
}
