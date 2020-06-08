/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { Track } from './interfaces/track.interface';
import { Room } from 'src/rooms/interfaces/room.interface';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class TracksService {
  constructor(private readonly firebaseService: FirebaseService) {}

  private tracks: Track[];
  private track: Track;

  async findByRoom(room: Room): Promise<Track[]> {
    const querySnapshot = await this.firebaseService.db
      .collection('tracks')
      .where('room', '==', room)
      .orderBy('vote', 'desc')
      .orderBy('created_at', 'asc')
      .get();
    querySnapshot.forEach(doc => {
      this.tracks.push(doc.data());
    });
    return this.tracks;
  }

  async findCurrent(room: Room): Promise<Track> {
    const querySnapshot = await this.firebaseService.db
      .collection('tracks')
      .where('room', '==', room)
      .where('current', '==', true)
      .limit(1)
      .get();

    querySnapshot.forEach(doc => {
      this.track = doc.data();
    });
    return this.track;
  }

  async deleteCurrent(room: Room): Promise<any> {
    const querySnapshot = await this.firebaseService.db
      .collection('tracks')
      .where('room', '==', room)
      .where('played_at', '!=', null)
      .get();

    querySnapshot.forEach(doc => {
      doc.ref.delete();
    });
  }

  async create(track: Track): Promise<any> {
    await this.firebaseService.db.collection('tracks').add({
      ...track,
      created: this.firebaseService.firebaseApp.firestore.FieldValue.serverTimestamp(),
    });
  }

  async delete(track: Track): Promise<any> {
    const querySnapshot = await this.firebaseService.db
      .collection('tracks')
      .where('room', '==', track.room)
      .where('id', '==', track.id)
      .get();
    querySnapshot.forEach(doc => {
      doc.ref.delete();
    });
  }

  async findNext(room: Room): Promise<Track> {
    // check if a track is queued
    const tracks = await this.findByRoom(room);
    if (tracks.length > 0) {
      this.track = tracks[0];
      await this.delete(this.track);
    }
  
    // change current track
    await this.deleteCurrent(room);
    if (this.track) {
      const querySnapshot = await this.firebaseService.db
        .collection("tracks")
        .where("room", "==", this.track.room)
        .where("id", "==", this.track.id)
        .get();
  
      querySnapshot.forEach(async doc => {
        await doc.ref.update({
          played_at: this.firebaseService.firebaseApp.firestore.FieldValue.serverTimestamp()
        });
      });
    }
  
    return this.track;
  }
  
  async findCurrentOrNext(room: Room): Promise<Track> {
    let track = await this.findCurrent(room);

    if (track === null) {
      track = await this.findNext(room);
    } else {
      const endTrackDate = DateTime.fromSeconds(track.played_at.seconds + (track.duration / 1000));
      const now = DateTime.local().setZone("utc");
      if (now >= endTrackDate) {
        track = await this.findNext(room);
      }
    }
    return track;
  }
}
