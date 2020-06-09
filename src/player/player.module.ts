import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerGateway } from './player.gateway';
import { TracksModule } from 'src/tracks/tracks.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [TracksModule, RoomsModule],
  providers: [PlayerService, PlayerGateway],
  exports: [PlayerService, PlayerGateway],
})
export class PlayerModule {}
