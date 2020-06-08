import { IsString } from 'class-validator';
import { User } from 'src/users/interfaces/user.interface';
import { Room } from 'src/rooms/interfaces/room.interface';

export class CreateTrackDto {
  @IsString()
  readonly room: Room;

  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly artist: string;

  @IsString()
  readonly duration: number;

  @IsString()
  readonly image_big: string;

  @IsString()
  readonly image_medium: string;

  @IsString()
  readonly image_small: string;

  @IsString()
  readonly user: User;

  @IsString()
  readonly played_at: any;
}
