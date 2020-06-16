import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import * as ent from 'ent';

@WebSocketGateway()
export class PlayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  async handleConnection() {
    console.log('IO: Connection');
    this.server.emit('user connection');
  }

  async handleDisconnect() {
    console.log('IO: Disconnect');
    this.server.emit('users disconnection');
  }

  @SubscribeMessage('LEAVE')
  async onLeave(client, roomName) {
    console.log('IO: Leave');
    client.leave(roomName);
  }

  @SubscribeMessage('JOIN')
  async onJoin(client, roomId) {
    console.log('IO: Join ' + roomId);
    client.join(roomId);
  }

  @SubscribeMessage('MESSAGE')
  async onMessage(client, data) {
    const message = '<b>[' + data.userName + ']</b>' + ent.encode(data.message);
    console.log('IO: Message : (' + data.roomId + ') [' + data.userName +'] ' + message);
    this.server
      .to(data.roomId)
      .emit('MESSAGE', message);
  }
}
