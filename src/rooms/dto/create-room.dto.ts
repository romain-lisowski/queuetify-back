import { IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  readonly name: string;
}
