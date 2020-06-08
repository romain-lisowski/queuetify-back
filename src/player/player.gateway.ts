import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway()
export class PlayerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;

  async handleConnection() {
    this.server.emit('user connection');
  }

  async handleDisconnect() {
    this.server.emit('users disconnection');
  }

  @SubscribeMessage('LEAVE')
  async onLeave(client, roomName) {
    client.leave(roomName);
  }

  @SubscribeMessage('JOIN')
  async onJoin(client, roomName) {
    client.join(roomName);
  }
}
