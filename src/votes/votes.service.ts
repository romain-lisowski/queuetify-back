import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Vote } from './interfaces/vote.interface';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class VotesService {
  @WebSocketServer()
  io: Server;

  constructor(private readonly firebaseService: FirebaseService) {}

  async vote(vote: Vote): Promise<any> {
    const doc = await this.firebaseService.db
      .collection('tracks')
      .doc(vote.track.id)
      .get();

    await doc.ref.update({
      vote: vote.track.vote + vote.increment,
      voters: this.firebaseService.firebase.firestore.FieldValue.arrayUnion(
        {
          ...vote.user,
          increment: vote.increment,
        },
      ),
    });

    this.io.to(vote.track.room_id).emit('REFRESH_TRACKS');
  }
}
