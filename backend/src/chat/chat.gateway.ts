import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket, WsException } from '@nestjs/websockets'
import {  } from '@nestjs/platform-socket.io'
import { ForbiddenException, InternalServerErrorException, Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AddMessageDto, NewRoomDto, OldRoomDto } from './dto';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { user_status } from 'src/utils';
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

        const joined_rooms = await this._chat.getJoinedRooms(user);
        console.log('joining old rooms');
        for (let r of joined_rooms)
        {
            console.log({r});
            client.join(r.id);
        }

        user = await this._userS.updateStatus(user.id, user_status.ONLINE);
    }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        this._logger.log(`client disconnected: ${client.id}`);

        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            return ;

        const joined_rooms = await this._chat.getJoinedRooms(user);
        console.log('leaving old rooms');
        for (let r of joined_rooms)
        {
            console.log({r});
            client.leave(r.id);
        }

        user = await this._userS.updateStatus(user.id, user_status.OFFLINE);
    }

    @SubscribeMessage('create_room')
    async createRoom(@MessageBody() room: NewRoomDto, @ConnectedSocket() client: Socket)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
        {
            throw new UnauthorizedException('you must login first');
        }
        const r = await this._chat.createRoom(user, room);
        client.emit('room_created', r);
    }

    @SubscribeMessage('delete_room')
    async deleteRoom(@MessageBody() room: OldRoomDto, @ConnectedSocket() client: Socket)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
        {
            throw new UnauthorizedException('you must login first');
        }
        const r = await this._chat.deleteRoom(user, room);
        client.emit('room_deleted', r);
    }

    @SubscribeMessage('send_message')
    async handleMessage(@MessageBody() data: AddMessageDto, @ConnectedSocket() client: Socket) //WsResponse<string>
    {
        const u = await this._userS.findById(data.uid);
        try
        {
            const m: Message = await this._chat.addMessage(data);
            if (!m) return ;
            const ret = {
                sender: {
                    uid: u.id,
                    imageUrl: u.imageUrl
                },
                msg: data.msg,
                timestamp: m.timestamp
            };
            this.server.to(data.rid).emit('receive_message', ret);
            return ;
        }
        catch
        {}
        // return {event: 'msgToClient', data}
    }

    @SubscribeMessage('join_room')
    handleJoinRoom(client: Socket, room: string)
    {
        console.log('join room');
        client.join(room);
        client.emit('joined_room', room);
    }
    
    @SubscribeMessage('leave_room')
    handleLeaveRoom(client: Socket, room: string)
    {
        client.leave(room);
        client.emit('left_room', room);
    }
}
