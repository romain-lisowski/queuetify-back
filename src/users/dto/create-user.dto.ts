import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly room_id: string;

  @IsString()
  readonly spotify_id: string;

  @IsString()
  readonly name: string;

  @IsString()
  readonly image: string;

  @IsString()
  readonly spotify_url: string;
}
