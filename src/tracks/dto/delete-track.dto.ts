import { IsString } from 'class-validator';

export class DeleteTrackDto {
  @IsString()
  readonly room_id: string;

  @IsString()
  readonly id: string;
}
