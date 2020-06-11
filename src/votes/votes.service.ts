/* eslint-disable @typescript-eslint/camelcase */
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
    const querySnapshot = await this.firebaseService.db
      .collection('tracks')
      .where('room_id', '==', vote.track.room_id)
      .where('id', '==', vote.track.id)
      .get();

    querySnapshot.forEach(async doc => {
      await doc.ref.update({
        vote: vote.track.vote + vote.increment,
        voters: this.firebaseService.firebaseApp.firestore.FieldValue.arrayUnion(
          {
            ...vote.user,
            increment: vote.increment,
          },
        ),
      });
    });

    this.io.to(vote.track.room_id).emit('REFRESH_TRACKS');
  }
}
