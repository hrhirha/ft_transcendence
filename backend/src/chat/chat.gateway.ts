import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket, WsException } from '@nestjs/websockets'
import {  } from '@nestjs/platform-socket.io'
import { ArgumentMetadata, BadRequestException, Catch, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AddMessageDto, DeleteMessageDto, MuteUserDto, NewRoomDto, OldRoomDto, UserRoomDto } from './dto';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { user_status } from 'src/utils';

export class WsValidationPipe extends ValidationPipe
{
    async transform(value: any, metadata: ArgumentMetadata) {
        try
        {
            return await super.transform(value, metadata);
        }
        catch (e)
        {
            if (e instanceof BadRequestException)
            {
                console.log({error: e.message});
                throw new WsException(e.message);
            }
        }
    }
}

@UsePipes(new WsValidationPipe({whitelist: true, transform: true, forbidNonWhitelisted: true}))
@WebSocketGateway({
    namespace: '/chat',
    cors : {
        origin: "http://127.0.0.1:3000",
        credentials: true,
    }
})
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
        // console.log('joining old rooms');
        for (let r of joined_rooms)
        {
            // console.log({r});
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
            throw new WsException('you must login first');
        }
        try
        {
            const r = await this._chat.createRoom(user, room);
            client.emit('room_created', r);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to create room');
        }
    }

    @SubscribeMessage('delete_room')
    async deleteRoom(@MessageBody() room: OldRoomDto, @ConnectedSocket() client: Socket)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
        {
            throw new WsException('you must login first');
        }
        try
        {
            const r = await this._chat.deleteRoom(user, room);
            client.emit('room_deleted', r);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to delete room');
        }
    }

    @SubscribeMessage('ban_user')
    async banUser(@MessageBody() ur: UserRoomDto, @ConnectedSocket() client: Socket)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
        {
            throw new WsException('you must login first');
        }
        try
        {
            const b = await this._chat.banUser(u, ur);
            this.server.emit('user_banned', b);
        }
        catch (e)
        {
            console.log({code: e.code, messasge: e.message});
            throw new WsException('user ban failed');
        }
    }

    @SubscribeMessage('unban_user')
    async unbanUser(@MessageBody() ur: UserRoomDto, @ConnectedSocket() client: Socket)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const b = await this._chat.unbanUser(u, ur);
            this.server.emit('user_unbanned', b);
        }
        catch (e)
        {
            console.log({code: e.code, messasge: e.message});
            throw new WsException('user unban failed');
        }
    }

    @SubscribeMessage('mute_user')
    async muteUser(@MessageBody() mu: MuteUserDto, @ConnectedSocket() client: Socket)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const m = await this._chat.muteUser(u, mu);
            client.emit('user_muted', m);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to mute member');
        }
    }

    @SubscribeMessage('send_message')
    async handleMessage(@MessageBody() data: AddMessageDto, @ConnectedSocket() client: Socket) //WsResponse<string>
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const m = await this._chat.addMessage(u, data);
            this.server.to(data.rid).emit('receive_message', m);
            return ;
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to send message');
        }
        // return {event: 'msgToClient', data}
    }

    @SubscribeMessage('delete_message')
    async deleteMessage(@MessageBody() msg: DeleteMessageDto, @ConnectedSocket() client: Socket)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const d = await this._chat.deleteMessage(u, msg);
            client.emit('message_deleted', d);
        }
        catch (e)
        {
            console.log({code: e.code, message:e.message});
            throw new WsException('failed to delete message');
        }
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
