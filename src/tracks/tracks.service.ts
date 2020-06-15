/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Track } from './interfaces/track.interface';
import { Room } from 'src/rooms/interfaces/room.interface';
import { FirebaseService } from 'src/firebase/firebase.service';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
@Injectable()
export class TracksService {
  @WebSocketServer()
  io: Server;

  constructor(private readonly firebaseService: FirebaseService) {}

  async findQueueTracks(roomId: string): Promise<Track[]> {
    const tracks: Track[] = [];
    const querySnapshot = await this.firebaseService.db
      .collection('tracks')
      .where('room_id', '==', roomId)
      .orderBy('vote', 'desc')
      .orderBy('created_at', 'asc')
      .get();

    querySnapshot.forEach(doc => {
      const track = doc.data();
      
      if (track && !track.played_at) {
        tracks.push(track);
      }
    });

    return tracks;
  }

  async findCurrentByRoomId(roomId: string): Promise<Track> {
    let current = null;
    const querySnapshot = await this.firebaseService.db
      .collection('tracks')
      .where('room_id', '==', roomId)
      .limit(1)
      .get();

    querySnapshot.forEach(doc => {
      const track = doc.data();
      if (track && track.played_at) {
        current = track;
      }
    });

    return current;
  }

  async deleteCurrent(room: Room): Promise<any> {
    const querySnapshot = await this.firebaseService.db
      .collection('tracks')
      .where('room_id', '==', room.id)
      .get();

    querySnapshot.forEach(doc => {
      const track = doc.data();
      if (track && track.played_at) {
        doc.ref.delete();
      }
    });
  }

  async create(createTrackDto: Track): Promise<any> {
    await this.firebaseService.db.collection('tracks').add({
      ...createTrackDto,
      vote: 0,
      voters: [],
      created_at: this.firebaseService.firebase.firestore.FieldValue.serverTimestamp(),
      played_at: null
    });

    this.io.to(createTrackDto.room_id).emit('REFRESH_TRACKS');
  }

  async delete(deleteTrackDto: Track): Promise<any> {
    const querySnapshot = await this.firebaseService.db
      .collection('tracks')
      .where('room_id', '==', deleteTrackDto.room_id)
      .where('id', '==', deleteTrackDto.id)
      .get();
    querySnapshot.forEach(doc => {
      doc.ref.delete();
    });

    this.io.to(deleteTrackDto.room_id).emit('REFRESH_TRACKS');
  }

  /**
   * Change current track
   * @param room 
   */
  async findNext(room: Room): Promise<Track> {
    let track = null;

    await this.deleteCurrent(room);
    
    // check if a track is queued
    const tracks = await this.findQueueTracks(room.id);
    if (tracks !== undefined && tracks.length > 0) {
      track = tracks[0];
    }

    if (track) {
      const querySnapshot = await this.firebaseService.db
        .collection('tracks')
        .where('room_id', '==', track.room_id)
        .where('id', '==', track.id)
        .get();

      querySnapshot.forEach(async doc => {
        await doc.ref.update({
          played_at: this.firebaseService.firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
    }

    return track;
  }

  async findCurrentOrNext(room: Room): Promise<Track> {
    let track = await this.findCurrentByRoomId(room.id);

    if (track === undefined || track === null) {
      track = await this.findNext(room);
    } else {
      const endTrackDate = DateTime.fromSeconds(
        track.played_at.seconds + track.duration / 1000,
      );
      const now = DateTime.local().setZone('utc');
      if (now >= endTrackDate) {
        track = await this.findNext(room);
      }
    }

    return track;
  }
}
