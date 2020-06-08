import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { PlayerModule } from './player/player.module';
import { FirebaseModule } from './firebase/firebase.module';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [
    RoomsModule,
    UsersModule,
    TracksModule,
    PlayerModule,
    FirebaseModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
