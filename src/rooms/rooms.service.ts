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
      rooms.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return rooms;
  }
  
  async findOneById(id: string): Promise<Room> {
    const doc = await this.firebaseService.db
      .collection('rooms')
      .doc(id)
      .get();
    
    return {
      id: doc.id,
      ...doc.data()
    };
  }

  async create(): Promise<Room> {
    const docRef = await this.firebaseService.db.collection('rooms').add({
      created_at: this.firebaseService.firebase.firestore.FieldValue.serverTimestamp(),
      name: null,
      current: null,
    });

    if (docRef) {
      const doc = await this.firebaseService.db
        .collection('rooms')
        .doc(docRef.id)
        .get();

      return {
        id: doc.id,
        ...doc.data()
      };
    }

    return null;
  }

  async delete(id: string): Promise<any> {
    const doc = await this.firebaseService.db
      .collection('rooms')
      .doc(id)
      .get();

    doc.ref.delete();
  }
}

