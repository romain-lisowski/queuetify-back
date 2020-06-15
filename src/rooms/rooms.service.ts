import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/room.interface';
import { FirebaseService } from 'src/firebase/firebase.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class RoomsService {
  @WebSocketServer()
  io: Server;

  constructor(private readonly firebaseService: FirebaseService) {}
  
  async findAll(): Promise<Room[]> {
    const rooms: Room[] = [];
    const querySnapshot = await this.firebaseService.db
      .collection('rooms')
      .orderBy('name', 'asc')
      .orderBy('created_at', 'asc')
      .get();
    
    querySnapshot.forEach(doc => {
      rooms.push(doc.data());
    });
    
    return rooms;
  }
  
  async findOneById(id: string): Promise<Room> {
    let room = null;
    const querySnapshot = await this.firebaseService.db
      .collection('rooms')
      .where('id', '==', id)
      .limit(1)
      .get();
    
    querySnapshot.forEach(doc => {
      room = doc.data();
    });
    
    return room;
  }

  async create(createRoomDto: Room): Promise<any> {
    await this.firebaseService.db.collection('rooms').add({
      ...createRoomDto,
      created_at: this.firebaseService.firebase.firestore.FieldValue.serverTimestamp(),
      current: null
    });

    this.io.to(createRoomDto.id).emit('ROOM_CREATED');
  }

  async delete(deleteRoomDto: Room): Promise<any> {
    const querySnapshot = await this.firebaseService.db
      .collection('rooms')
      .where('id', '==', deleteRoomDto.id)
      .get();

    querySnapshot.forEach(doc => {
      doc.ref.delete();
    });
  }
}

