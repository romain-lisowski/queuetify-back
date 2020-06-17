import { IsString, IsNumber } from 'class-validator';
import { User } from 'src/users/interfaces/user.interface';

export class CreateTrackDto {
  @IsString()
  readonly room_id: string;

  @IsString()
  readonly spotify_id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly artist: string;

  @IsNumber()
  readonly duration: number;

  @IsString()
  readonly image_big: string;

  @IsString()
  readonly image_medium: string;

  @IsString()
  readonly image_small: string;

  readonly user: User;
}
