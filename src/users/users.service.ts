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

  private users: User[];

  async findByRoom(room: Room): Promise<User[]> {
    const querySnapshot = await this.firebaseService.db
      .collection('users')
      .where('room', '==', room)
      .get();

    querySnapshot.forEach(doc => {
      this.users.push(doc.data());
    });

    return this.users;
  }

  async create(user: User): Promise<any> {
    await this.firebaseService.db
      .collection('users')
      .doc(user.spotify_id)
      .set({
        ...user,
      });

    this.io.to(user.room.name).emit("REFRESH_USERS");
  }

  async delete(user: User): Promise<any> {
    const querySnapshot = await this.firebaseService.db
      .collection('users')
      .where('room', '==', user.room)
      .where('spotify_id', '==', user.spotify_id)
      .get();
    querySnapshot.forEach(doc => {
      doc.ref.delete();
    });

    this.io.to(user.room.name).emit("REFRESH_USERS");
  }
}
