import { Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({
  cors: {
    credentials: true,
    methods: ['GET', 'POST'],
    origin: ['http://localhost:8081'],
  },
  transports: ['polling', 'websocket'],
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload, client.id);
  }

  @SubscribeMessage('likeButtonServer')
  handleEvent(client: Socket, payload: string): void {
    this.server.emit('likeButtonClient', payload, client.id);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleConnection(socket: Socket) {
    try {
      const tokenArray: string[] =
        socket.handshake.headers.authorization.split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);

      const user = await this.userService.findOneOrFail(decodedToken.sub);

      if (!user) {
        return this.disconnect(socket);
      } else this.logger.log(`Client connected: ${socket.id}`);
    } catch (error) {
      return this.disconnect(socket);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
