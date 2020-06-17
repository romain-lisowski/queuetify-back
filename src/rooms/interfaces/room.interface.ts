import { Track } from "src/tracks/interfaces/track.interface";
import { User } from "src/users/interfaces/user.interface";

export interface Room {
  readonly name?: string;
  readonly id?: string;
  readonly created_at?: string;
  current?: Track;
  user?: User;
}
