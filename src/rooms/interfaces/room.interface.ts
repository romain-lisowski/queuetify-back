import { Track } from "src/tracks/interfaces/track.interface";

export interface Room {
  readonly id: string;
  readonly name: string;
  readonly created_at?: string;
  current?: Track;
}
