import { IsString, IsNumber } from 'class-validator';
import { User } from 'src/users/interfaces/user.interface';
import { Track } from 'src/tracks/interfaces/track.interface';
import { ApiProperty } from '@nestjs/swagger';

export class VoteDto {
  @ApiProperty()
  @IsString()
  readonly track: Track;

  @ApiProperty()
  @IsNumber()
  readonly increment: number;

  @ApiProperty()
  @IsString()
  readonly user: User;
}
