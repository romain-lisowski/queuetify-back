import { IsString } from 'class-validator';
import { Room } from 'src/rooms/interfaces/room.interface';

export class DeleteUserDto {
  @IsString()
  readonly room: Room;

  @IsString()
  readonly spotify_id: string;
}
