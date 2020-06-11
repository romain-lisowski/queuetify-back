import { IsString } from 'class-validator';

export class DeleteUserDto {
  @IsString()
  readonly room_id: string;

  @IsString()
  readonly spotify_id: string;
}
