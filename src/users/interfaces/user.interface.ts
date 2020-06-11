export interface User {
  readonly room_id: string;
  readonly spotify_id: string;
  readonly name?: string;
  readonly image?: string;
  readonly spotify_url?: string;
}
