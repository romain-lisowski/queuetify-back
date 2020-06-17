import { User } from 'src/users/interfaces/user.interface';
import { IsObject } from 'class-validator';

export class CreateRoomDto {
  @IsObject()
  readonly user: User;
}
