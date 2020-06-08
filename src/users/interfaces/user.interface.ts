import { Room } from 'src/rooms/interfaces/room.interface';

export interface User {
  readonly room: Room;
  readonly spotify_id: string;
  readonly name?: string;
  readonly image?: string;
  readonly spotify_url?: string;
}
