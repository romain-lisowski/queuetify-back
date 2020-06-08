import { User } from 'src/users/interfaces/user.interface';
import { Room } from 'src/rooms/interfaces/room.interface';

export interface Track {
  readonly room: Room;
  readonly id: string;
  readonly name?: string;
  readonly artist?: string;
  readonly duration?: number;
  readonly image_big?: string;
  readonly image_medium?: string;
  readonly image_small?: string;
  readonly user?: User;
  readonly vote?: number;
  readonly voters?: User[];
  readonly played_at?: any;
}
