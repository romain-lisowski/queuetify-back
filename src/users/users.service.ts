import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { Room } from 'src/rooms/interfaces/room.interface';
import { FirebaseService } from 'src/firebase/firebase.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class UsersService {
  @WebSocketServer()
  io: Server

  constructor(private readonly firebaseService: FirebaseService) {}

  async findByRoom(room: Room): Promise<User[]> {
    const users: User[] = [];
    const querySnapshot = await this.firebaseService.db
      .collection('users')
      .where('room_id', '==', room.id)
      .get();

    querySnapshot.forEach(doc => {
      users.push(doc.data());
    });

    return users;
  }

  async create(user: User): Promise<any> {
    await this.firebaseService.db
      .collection('users')
      .doc(user.spotify_id)
      .set({
        ...user,
      });

    this.io.to(user.room_id).emit("REFRESH_USERS");
  }

  async delete(user: User): Promise<any> {
    const querySnapshot = await this.firebaseService.db
      .collection('users')
      .where('room_id', '==', user.room_id)
      .where('spotify_id', '==', user.spotify_id)
      .get();

    querySnapshot.forEach(doc => {
      doc.ref.delete();
    });

    this.io.to(user.room_id).emit("REFRESH_USERS");
  }
}
