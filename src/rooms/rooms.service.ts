import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/room.interface';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class RoomsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  private rooms: Room[] = [];

  async findAll(): Promise<Room[]> {
    const querySnapshot = await this.firebaseService.db
      .collection('rooms')
      .orderBy('name', 'asc')
      .orderBy('created_at', 'asc')
      .get();
    querySnapshot.forEach(doc => {
      this.rooms.push(doc.data());
    });

    return this.rooms;
  }
}
