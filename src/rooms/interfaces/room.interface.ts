import { Track } from "src/tracks/interfaces/track.interface";

export interface Room {
  readonly name?: string;
  readonly id?: string;
  readonly created_at?: string;
  current?: Track;
  password?: string;
}
