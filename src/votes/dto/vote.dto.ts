import { IsString, IsNumber, IsObject } from 'class-validator';
import { User } from 'src/users/interfaces/user.interface';
import { Track } from 'src/tracks/interfaces/track.interface';

export class VoteDto {
  @IsObject()
  readonly track: Track;

  @IsNumber()
  readonly increment: number;

  @IsObject()
  readonly user: User;
}
