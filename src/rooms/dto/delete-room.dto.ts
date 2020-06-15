import { IsString } from 'class-validator';

export class DeleteRoomDto {
  @IsString()
  readonly id: string;
}
