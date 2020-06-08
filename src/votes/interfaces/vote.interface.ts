import { Track } from 'src/tracks/interfaces/track.interface';
import { User } from 'src/users/interfaces/user.interface';

export interface Vote {
  readonly track: Track;
  readonly increment: number;
  readonly user: User;
}
