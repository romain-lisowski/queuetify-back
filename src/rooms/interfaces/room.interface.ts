import { Track } from "src/tracks/interfaces/track.interface";

export interface Room {
  readonly name: string;
  readonly created_at?: string;
  current?: Track;
}
