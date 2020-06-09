import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [FirebaseModule],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}

