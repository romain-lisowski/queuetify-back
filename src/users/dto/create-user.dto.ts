import { IsString } from 'class-validator';
import { Room } from 'src/rooms/interfaces/room.interface';

export class CreateUserDto {
  @IsString()
  readonly room: Room;

  @IsString()
  readonly spotify_id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly image: string;

  @IsString()
  readonly spotify_url: string;
}
