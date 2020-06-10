import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/room.interface';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class RoomsService {
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
}
