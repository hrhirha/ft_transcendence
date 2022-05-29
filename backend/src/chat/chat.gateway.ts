import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket, WsException } from '@nestjs/websockets'
import {  } from '@nestjs/platform-socket.io'
import { ForbiddenException, InternalServerErrorException, Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AddMessageDto } from './dto';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { user_status } from 'src/utils';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { Message } from '@prisma/client';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private _chat: ChatService,
        private _userS: UserService) {}
        
    @WebSocketServer() server: Server;
    
    private _logger: Logger = new Logger('ChatGateway');

    afterInit(server: Server) {
        this._logger.log("initialized..");
    }
        
    async handleConnection(@ConnectedSocket() client: Socket) {
        this._logger.log(`client connected: ${client.id}`);

        let user = await this._chat.getUserFromSocket(client);
        if (!user)
        {
            client.disconnect(true);
            return ;
        }

        user = await this._userS.updateStatus(user.id, user_status.ONLINE);
        console.log({user});
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        this._logger.log(`client disconnected: ${client.id}`);

        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            return ;

        user = await this._userS.updateStatus(user.id, user_status.OFFLINE);
    }

    @SubscribeMessage('chatToServer')
    async handleMessage(@MessageBody() data: AddMessageDto, @ConnectedSocket() client: Socket) //WsResponse<string>
    {
        try
        {
            const m: Message = await this._chat.addMessage(data);
            this.server.to(data.rid).emit('chatToClient', m);
            return ;
        }
        catch
        {
            throw new InternalServerErrorException();
        }
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
