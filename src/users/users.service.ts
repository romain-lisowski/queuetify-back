import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { FirebaseService } from 'src/firebase/firebase.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DeleteUserDto } from './dto/delete-user.dto';

@WebSocketGateway()
@Injectable()
export class UsersService {
  @WebSocketServer()
  io: Server

  constructor(private readonly firebaseService: FirebaseService) {}

  async findByRoomId(roomId: string): Promise<User[]> {
    const users: User[] = [];
    const querySnapshot = await this.firebaseService.db
      .collection('users')
      .where('room_id', '==', roomId)
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

  async delete(deleteUserDto: DeleteUserDto): Promise<any> {
    const doc = await this.firebaseService.db
      .collection('users')
      .doc(deleteUserDto.id)
      .get();
    doc.ref.delete();

    this.io.to(deleteUserDto.room_id).emit("REFRESH_USERS");
  }
}
