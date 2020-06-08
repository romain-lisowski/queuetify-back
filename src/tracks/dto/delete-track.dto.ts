import { IsString } from 'class-validator';
import { Room } from 'src/rooms/interfaces/room.interface';

export class DeleteTrackDto {
  @IsString()
  readonly room: Room;

  @IsString()
  readonly id: string;
}
