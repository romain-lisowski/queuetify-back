import { IsString, IsNumber } from 'class-validator';
import { User } from 'src/users/interfaces/user.interface';
import { Track } from 'src/tracks/interfaces/track.interface';

export class VoteDto {
  @IsString()
  readonly track: Track;

  @IsNumber()
  readonly increment: number;

  @IsString()
  readonly user: User;
}
