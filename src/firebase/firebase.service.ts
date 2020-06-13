import { Injectable } from '@nestjs/common';
import { firebase } from '@firebase/app';
import '@firebase/firestore';

@Injectable()
export class FirebaseService {
  public firebase;
  public firebaseApp;
  public readonly db;

  constructor() {
    this.firebaseApp = firebase.initializeApp({
      apiKey: process.env.FIREBASE_APIKEY,
      authDomain: process.env.FIREBASE_AUTHDOMAIN,
      databaseURL: process.env.FIREBASE_DATABASEURL,
      projectId: process.env.FIREBASE_PROJECTID,
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
      appId: process.env.FIREBASE_APPID,
      measurementId: process.env.FIREBASE_MEASUREMENTID,
    });

    this.firebase = firebase;

    this.db = this.firebaseApp.firestore();
  }
}
