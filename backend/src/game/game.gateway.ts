import { Server, Socket } from 'socket.io';
import { 
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse 
} from '@nestjs/websockets';


@WebSocketGateway({ cors: true, namespace: 'game'})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server : Server;

    handleDisconnect(client: Socket) {
       console.log('Client Disconnect with ID: ' + client.id);
    }

    handleConnection(client: Socket, ...args: any[]) {
        console.log('Client Connected with ID: ' + client.id);
    }

    @SubscribeMessage('server')
    checkConnection(client: Socket, text: string) : WsResponse<string>
    {
        return {
            event: 'FromTheServerToClient', data: text
        };
        // this.server.emit('game', msg);
    }
}
