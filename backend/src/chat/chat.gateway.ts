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
            let user = await this._chat.getUserFromSocket(client);
            if (!user)
                throw new WsException('login first');
            client.data.username = user.username;
            const rooms = await this._chat.newConnection(user);
            client.join(rooms);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            client.disconnect();
        }
    }

    async handleDisconnect(@ConnectedSocket() client: Socket)
    {
        this._logger.log(`client disconnected: ${client.id}`);

        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            return;

        await this._userS.updateStatus(user.id, user_status.OFFLINE);
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

            const sockets = (await this.server.fetchSockets()).filter((s) => {
                return r.usernames.indexOf(s.data.username) >= 0;
            });

            let room_users = []
            for (let s of sockets)
            {
                console.log(s.data.username);
                room_users.push(s.id);
            }

            this.server.to(room_users).emit('join_invite', {rid: r.room.id});
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
            await this._chat.deleteRoom(user, room);
            client.to(room.id).emit('leave_call', {rid: room.id});
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
            this.server.to(u.id).emit('join_invite', {rid: r.id});
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to start dm');
        }
    }

    @SubscribeMessage('join_room')
    async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: OldRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.joinRoom(user, room);
            client.join(room.id);
            this.server.to(r.id).emit('user_joined', `${client.data.username} joined`);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to join room');
        }
    }
    
    @SubscribeMessage('leave_room')
    async leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: OldRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.leaveRoom(user, room);
            client.leave(room.id);
            this.server.to(r.id).emit('user_left', `${client.data.username} left`);
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

            // if bnned_users.usernames[] caontains socket.data.username:
            //      don't emit to socket
            const users = await this._chat.getRoomMembers(u.id, data.rid);
            const banned_usernames = [];
            for (let ur of users)
            {
                if (ur.is_banned)
                    banned_usernames.push(ur.user.username);
            }

            const banned_sockets = (await this.server.fetchSockets()).filter((s)=>{ return banned_usernames.indexOf(s.data.username) > 0 });
            let bans = [];
            for (let s of banned_sockets)
                bans.push(s.id);

            this.server.except(bans).to(data.rid).emit('receive_message', m);
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

    @SubscribeMessage('join')
    join(@ConnectedSocket() client: Socket, @MessageBody() r: OldRoomDto)
    {
        client.join(r.id);
        this.server.to(r.id).emit('user_joined', `${client.data.username} joined`);
    }

    @SubscribeMessage('leave')
    leave(@ConnectedSocket() client: Socket, @MessageBody() r: OldRoomDto)
    {
        this.server.to(r.id).emit('user_left', `${client.data.username} left`);
        client.leave(r.id);
    }
}
