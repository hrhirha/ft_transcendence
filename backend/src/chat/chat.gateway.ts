import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, ConnectedSocket, WsException } from '@nestjs/websockets'
import {  } from '@nestjs/platform-socket.io'
import { ArgumentMetadata, HttpException, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AddMessageDto, ChangePasswordDto, DeleteMessageDto, EditRoomDto, MuteUserDto, NewRoomDto, OldRoomDto, RemovePasswordDto, SetPasswordDto, UserRoomDto } from './dto';
import { ChatService } from './chat.service';
import { UserService } from 'src/user/user.service';
import { HOST, user_status } from 'src/utils';
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
        origin: `http://${HOST}:3000`,
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
        
    async handleConnection(@ConnectedSocket() client: Socket)
    {
        this._logger.log(`client connected: ${client.id}`);

        try
        {
            let user = await this._chat.getUserFromSocket(client);
            if (!user)
                throw new WsException('login first');
            client.data.username = user.username;
            const rooms = await this._chat.newConnection(user);
            client.join(rooms);
            client.broadcast.emit('status_update');
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
        client.broadcast.emit('status_update');
    }

    @SubscribeMessage('create_room') // _add_msg_to_db(msg_type.NOTIF);
    async  createRoom(@ConnectedSocket() client: Socket, @MessageBody() room: NewRoomDto)
    {
        const user = await this._chat.getUserFromSocket(client);
        if (!user)
        throw new WsException('you must login first');
        
        try
        {
            const r = await this._chat.createRoom(user, room);
            const sockets = await this.server.fetchSockets();

            sockets.forEach((s)=> {
                console.log(`${s.data.username} joined`);
                r.ret.usernames.includes(s.data.username) && s.join(r.ret.room.id);
            });

            // this.server.to(r.room.id).emit('room_created', r.room);
            client.emit('room_created', r.ret.room);
            client.broadcast.to(r.ret.room.id).emit('receive_message', r.m);
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
            this.server.to(room.id).emit('room_deleted', { id: room.id });
            this.server.in(room.id).socketsLeave(room.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to delete room');
        }
    }

    @SubscribeMessage('set_password')
    async setPassword(@ConnectedSocket() client: Socket, @MessageBody() dto: SetPasswordDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.setPassword(user, dto);
            client.emit('password_edited', r);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to set password');
        }
    }

    @SubscribeMessage('change_password')
    async changePassword(@ConnectedSocket() client: Socket, @MessageBody() dto: ChangePasswordDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.changePassword(user, dto);
            client.emit('password_edited', r);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to change password');
        }
    }
 
    @SubscribeMessage('remove_password')
    async removePassword(@ConnectedSocket() client: Socket, @MessageBody() dto: RemovePasswordDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.removePassword(user, dto);
            client.emit('password_edited', r);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to remove password');
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
            const sockets = (await this.server.fetchSockets());

            const me = r.user1.username === user.username ? r.user1 : r.user2;
            const other = r.user1.username !== user.username ? r.user1 : r.user2;

            client.join(r.room.id);
            client.emit('dm_started', { room: r.room, user: other, is_blocked: r.is_blocked });

            sockets.forEach((s)=> {
                if (s.data.username === other.username)
                {
                    s.join(r.room.id);
                    // this.server.to(s.id).emit('dm_started', { room: r.room, user: me, is_blocked: r.is_blocked  });
                }
            });
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to start dm');
        }
    }

    @SubscribeMessage('join_room') // _add_msg_to_db(msg_type.NOTIF);
    async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: OldRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.joinRoom(user, room);
            client.join(room.id);
            this.server.to(r.room.id).emit('user_joined', r);
            this.server.to(r.room.id).emit('receive_message', r.msg);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to join room');
        }
    }
    
    @SubscribeMessage('leave_room') // _add_msg_to_db(msg_type.NOTIF);
    async leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() room: OldRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const r = await this._chat.leaveRoom(user, room);
            this.server.to(room.id).emit('user_left', { rid: r.room.id, uid: user.id });
            this.server.to(room.id).emit('receive_message', r.msg);
            client.leave(room.id);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to leave room');
        }
    }

    @SubscribeMessage('edit_room') // _add_msg_to_db(msg_type.NOTIF);
    async editRoom(@ConnectedSocket() client: Socket, @MessageBody() data: EditRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const edit = await this._chat.editRoom(user, data);
            const sockets = await this.server.fetchSockets();

            sockets.forEach((s) => {
                edit.members.forEach(member => {
                    s.data.username === member.username && s.join(data.rid);
                });
            });
            edit.messages.forEach(message => this.server.to(data.rid).emit('receive_message', message));
            delete edit.messages;
            client.emit('room_edited', edit);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to edit room');
        }
    }

    @SubscribeMessage('remove_member') // _add_msg_to_db(msg_type.NOTIF);
    async removeUser(@ConnectedSocket() client: Socket, @MessageBody() member: UserRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            const ur = await this._chat.removeUser(user, member);
            const sockets = await this.server.fetchSockets();

            sockets.forEach((s) => {
                s.data.username === ur.ur.user.username && s.join(member.rid);
            });
            this.server.to(member.rid).emit('user_left', ur.ur);
            this.server.to(member.rid).emit('receive_message', ur.msg);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to add user');
        }
    }

    @SubscribeMessage('add_admin')
    async addAdmin(@ConnectedSocket() client: Socket, @MessageBody() ur: UserRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            await this._chat.addAdmin(user, ur);
            this.server.to(ur.rid).emit('admin_added', ur);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to add admin');
        }
    }

    @SubscribeMessage('remove_admin')
    async removeAdmin(@ConnectedSocket() client: Socket, @MessageBody() ur: UserRoomDto)
    {
        let user = await this._chat.getUserFromSocket(client);
        if (!user)
            throw new WsException('you must login first');
        try
        {
            await this._chat.removeAdmin(user, ur);
            this.server.to(ur.rid).emit('admin_removed', ur);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to remove admin');
        }
    }

    @SubscribeMessage('ban_user') // _add_msg_to_db(msg_type.NOTIF);
    async banUser(@ConnectedSocket() client: Socket, @MessageBody() ur: UserRoomDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const ur0 = await this._chat.banUser(u, ur);
            const sockets = await this.server.fetchSockets();
            
            this.server.to(ur.rid).emit('user_banned', ur);
            sockets.forEach((s) => {
                ur0.user.username === s.data.username && s.leave(ur.rid);
            });
        }
        catch (e)
        {
            console.log({code: e.code, messasge: e.message});
            throw new WsException('user ban failed');
        }
    }

    @SubscribeMessage('unban_user') // _add_msg_to_db(msg_type.NOTIF);
    async unbanUser(@ConnectedSocket() client: Socket, @MessageBody() ur: UserRoomDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const ur0 = await this._chat.unbanUser(u, ur);
            const sockets = await this.server.fetchSockets();
            
            sockets.forEach((s) => {
                ur0.user.username === s.data.username && s.join(ur.rid);
            });
            this.server.to(ur.rid).emit('user_unbanned', ur0);
        }
        catch (e)
        {
            console.log({code: e.code, messasge: e.message});
            throw new WsException('user unban failed');
        }
    }

    @SubscribeMessage('mute_user') // _add_msg_to_db(msg_type.NOTIF);
    async muteUser(@ConnectedSocket() client: Socket, @MessageBody() mu: MuteUserDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            await this._chat.muteUser(u, mu);
            this.server.to(mu.rid).emit('user_muted', { uid: mu.uid, rid: mu.rid });
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to mute member');
        }
    }

    @SubscribeMessage('unmute_user') // _add_msg_to_db(msg_type.NOTIF);
    async unmuteUser(@ConnectedSocket() client: Socket, @MessageBody() mu: UserRoomDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const m = await this._chat.unmuteUser(u, mu);
            this.server.to(mu.rid).emit('user_unmuted', mu);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to unmute member');
        }
    }

    @SubscribeMessage('send_message') // _add_msg_to_db(msg_type.TXT);
    async sendMessage(@ConnectedSocket() client: Socket, @MessageBody() data: AddMessageDto) //WsResponse<string>
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const m = await this._chat.sendMessage(u, data);

            // filter banned users and blocked friends
            const urs = await this._chat.getRoomMembers(u.id, data.rid);
            const uname_blk_lst = [];
            for (let ur of urs.members)
            {
                ur.is_banned && uname_blk_lst.push(ur.username);
            }
            if (!urs.is_channel)
            {
                const blocks = await this._userS.getBlockedFriends(u.id);
                for (let b of blocks)
                    uname_blk_lst.push(b.username);
            }

            const sockets = (await this.server.fetchSockets()).filter((s)=>{ return uname_blk_lst.indexOf(s.data.username) >= 0 });
            let blk_lst = [];
            for (let s of sockets)
                blk_lst.push(s.id);

            this.server.except(blk_lst).to(data.rid).emit('receive_message', m);
            return ;
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new WsException('failed to send message');
        }
    }

    @SubscribeMessage('delete_message') // _add_msg_to_db(msg_type.DEL);
    async deleteMessage(@ConnectedSocket() client: Socket, @MessageBody() msg: DeleteMessageDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const d = await this._chat.deleteMessage(u, msg);
            this.server.to(msg.rid).emit('message_deleted', msg);
        }
        catch (e)
        {
            console.log({code: e.code, message:e.message});
            throw new WsException('failed to delete message');
        }
    }

    @SubscribeMessage('challenge')
    async inviteToGame(@ConnectedSocket() client: Socket, @MessageBody() opponent: UserIdDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const d = await this._chat.getOpponent(u, opponent);
            const sockets = await this.server.fetchSockets();

            const so = sockets.find(s=>{ return s.data.username === d.username });
            so && this.server.to(so.id).emit('challenge_requested', u);
        }
        catch (e)
        {
            console.log({code: e.code, message:e.message});
            throw new WsException('failed to challenge user to a game');
        }
    }

    @SubscribeMessage('get_chats')
    async getJoinedChatRooms(@ConnectedSocket() client: Socket)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const dms = await this._chat.getDms(u);
            const rooms = await this._chat.getJoinedRooms(u);
            const others = await this._chat.getRooms(u);
            client.emit('chats', { dms, rooms, others });
        }
        catch (e)
        {
            console.log({error: e.message});
            throw new WsException('failed to get chatrooms');
        }
    }

    @SubscribeMessage('get_members')
    async getRoomMembers(@ConnectedSocket() client: Socket, @MessageBody() room: OldRoomDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const members = (await this._chat.getRoomMembers(u.id, room.id)).members;
            for (let m of members) delete m.is_banned
            client.emit('members', members);
        }
        catch (e)
        {
            console.log({error: e.message});
            throw new WsException('failed to get chatrooms');
        }
    }

    @SubscribeMessage('get_messages')
    async getRoomMessages(@ConnectedSocket() client: Socket, @MessageBody() room: OldRoomDto)
    {
        let u = await this._chat.getUserFromSocket(client);
        if (!u)
            throw new WsException('you must login first');
        try
        {
            const msgs = await this._chat.getRoomMessages(u.id, room.id);
            client.emit('messages', msgs);
        }
        catch (e)
        {
            // console.log({error: e.message});
            throw new WsException('failed to get chatrooms');
        }
    }

    // @SubscribeMessage('owned_rooms')
    // async ownedRooms(@ConnectedSocket() client: Socket)
    // {
    //     let u = await this._chat.getUserFromSocket(client);
    //     if (!u)
    //         throw new WsException('you must login first');
    //     try
    //     {
    //         return await this._chat.ownedRooms(u);
    //     }
    //     catch (e)
    //     {
    //         console.log({code: e.code, message: e.message});
    //         throw new WsException('failed to get created rooms');
    //     }
    // }
}
