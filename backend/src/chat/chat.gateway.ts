import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, WsResponse, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket, WsException } from '@nestjs/websockets'
import {  } from '@nestjs/platform-socket.io'
import { ArgumentMetadata, Catch, HttpException, Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AddMessageDto, DeleteMessageDto, MuteUserDto, NewRoomDto, OldRoomDto, UserRoomDto } from './dto';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { user_status } from 'src/utils';
import { UserIdDto } from 'src/user/dto';

export class WsValidationPipe extends ValidationPipe
{
    async transform(value: any, metadata: ArgumentMetadata) {
        try
        {
            return await super.transform(value, metadata);
        }
        catch (e)
        {
            if (e instanceof HttpException)
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

        try
        {
            let user = await this._joinOldRooms(client);
            user = await this._userS.updateStatus(user.id, user_status.ONLINE);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to connect to server');
        }
    }

    @SubscribeMessage('refresh')
    async _joinOldRooms(@ConnectedSocket() client: Socket)
    {
        console.log('joining old rooms');
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
        {
            throw new WsException('you must login first');
        }
        // for (let soc of client.rooms)
        //     console.log({soc});
        try
        {
            const joined_rooms = await this._chat.getJoinedRooms(user);
            for (let r of joined_rooms)
            {
                if (!client.rooms.has(r.id))
                {
                    client.join(r.id);
                }
                console.log({name: r.name, is_channel: r.is_channel});
            }
            return user;
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to refresh joined room');
        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket)
    {
        this._logger.log(`client disconnected: ${client.id}`);

        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');

        const joined_rooms = await this._chat.getJoinedRooms(user);
        console.log('leaving old rooms');
        for (let r of joined_rooms)
        {
            console.log({id: r.id});
            client.leave(r.id);
        }

        user = await this._userS.updateStatus(user.id, user_status.OFFLINE);
    }

    @SubscribeMessage('create_room')
    async createRoom(@ConnectedSocket() client: Socket, @MessageBody() room: NewRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.createRoom(user, room);
            client.join(r.id);
            client.emit('room_created', r);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to create room');
        }
    }

    @SubscribeMessage('delete_room')
    async deleteRoom(@ConnectedSocket() client: Socket, @MessageBody() room: OldRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.deleteRoom(user, room);
            client.leave(room.id);
            client.emit('room_deleted', r);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to delete room');
        }
    }

    @SubscribeMessage('start_dm')
    async startDm(@ConnectedSocket() client: Socket,@MessageBody() u: UserIdDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.start_dm(user, u);
            this.server.emit('refresh');
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to start dm');
        }
    }

    @SubscribeMessage('join_room')
    async joinRoom(@ConnectedSocket() client: Socket, room: OldRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.joinRoom(user, room);
            client.join(room.id);
            client.emit('joined_room', r);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to join room');
        }
    }
    
    @SubscribeMessage('leave_room')
    async leaveRoom(@ConnectedSocket() client: Socket, room: OldRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.leaveRoom(user, room);
            client.leave(room.id);
            client.emit('left_room', room);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to leave room');
        }
    }

    @SubscribeMessage('add_member')
    async addUser(@ConnectedSocket() client: Socket, @MessageBody() member: UserRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            await this._chat.addUser(user, member);
            this.server.emit('refresh');
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to add user');
        }
    }
    @SubscribeMessage('remove_member')
    async removeUser(@ConnectedSocket() client: Socket, @MessageBody() member: UserRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            await this._chat.addUser(user, member);
            this.server.emit('refresh');
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to add user');
        }
    }

    @SubscribeMessage('ban_user')
    async banUser(@ConnectedSocket() client: Socket, @MessageBody() ur: UserRoomDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
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
    async unbanUser(@ConnectedSocket() client: Socket, @MessageBody() ur: UserRoomDto)
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
    async muteUser(@ConnectedSocket() client: Socket, @MessageBody() mu: MuteUserDto)
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

    @SubscribeMessage('unmute_user')
    async unmuteUser(@ConnectedSocket() client: Socket, @MessageBody() mu: UserRoomDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const m = await this._chat.unmuteUser(u, mu);
            client.emit('user_unmuted', m);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to unmute member');
        }
    }

    @SubscribeMessage('send_message')
    async sendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: AddMessageDto) //WsResponse<string>
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const m = await this._chat.sendMessage(u, data);
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
    async deleteMessage(@ConnectedSocket() client: Socket, @MessageBody() msg: DeleteMessageDto)
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
}
