import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/room.interface';
import { FirebaseService } from 'src/firebase/firebase.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CreateRoomDto } from './dto/create-room.dto';

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
      rooms.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return rooms;
  }

  async findPublic(): Promise<Room[]> {
    const rooms: Room[] = [];
    const querySnapshot = await this.firebaseService.db
      .collection('rooms')
      .orderBy('name', 'asc')
      .orderBy('created_at', 'asc')
      .get();
    
    querySnapshot.forEach(doc => {
      const room = {
        id: doc.id,
        ...doc.data()
      };

      if (!room.user) {
        rooms.push(room);
      }
    });
    
    return rooms;
  }
  
  async findOneById(id: string): Promise<Room> {
    let room = null;
    const doc = await this.firebaseService.db
      .collection('rooms')
      .doc(id)
      .get();
    
    if (doc.exists) {
      room = {
        id: doc.id,
        ...doc.data()
      }; 
    }

    return room;
  }

  async findOneOrCreateRoom(createRoomDto: CreateRoomDto): Promise<Room>{
    let room = await this.findOneById(createRoomDto.user.spotify_id);
    if (!room) {
      room = await this.create(createRoomDto);
    }
    
    return room;
  }

  async create(createRoomDto): Promise<Room> {
    let room = null;

    // insert room
    await this.firebaseService.db
      .collection('rooms')
      .doc(createRoomDto.user.spotify_id)
      .set({
        created_at: this.firebaseService.firebase.firestore.FieldValue.serverTimestamp(),
        name: createRoomDto.user.name + "'s room",
        current: null,
        user: createRoomDto.user
      });

    // get room inserted
    const doc = await this.firebaseService.db
      .collection('rooms')
      .doc(createRoomDto.user.spotify_id)
      .get();

    if (doc.exists) {
      room = {
        id: doc.id,
        ...doc.data()
      }
    };

    return room;
  }

  async delete(id: string): Promise<any> {
    const doc = await this.firebaseService.db
      .collection('rooms')
      .doc(id)
      .get();

    if (doc.exists) {
      doc.ref.delete();
    }
  }
}

