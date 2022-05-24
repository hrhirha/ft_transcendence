import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets'
import {  } from '@nestjs/platform-socket.io'
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;

    private _logger: Logger = new Logger('ChatGateway');
    
    afterInit(server: Server) {
        this._logger.log("initialized..");
    }

    handleConnection(client: Socket, ...args: any[]) {
        this._logger.log(`client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        this._logger.log(`client disconnected: ${client.id}`);
    }

    @SubscribeMessage('chatToServer')
    handleMessage(@MessageBody() data: {sender: string, room: string, message: string}): void //WsResponse<string>
    {
        this.server.to(data.room).emit('chatToClient', data);
        // return {event: 'msgToClient', data}
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string)
    {
        client.join(room);
        client.emit('joinedRoom', room);
    }
    
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string)
    {
        client.leave(room);
        client.emit('leftRoom', room);
    }
}
