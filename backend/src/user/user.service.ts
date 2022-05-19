import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {

    constructor(private _prismaS: PrismaService) {}

    // User
    async findById(id:string) {
        const user = await this._prismaS.user.findUnique({
            where: { id, },
        });
        return user;
    }

    async enable2fa(id: string) {
        const user = await this.findById(id);
        if (!user)
            throw new ForbiddenException('user not found')
        if (user.isTfaEnabled === true)
            return new Error('2fa already enabled');

        return await this._prismaS.user.update({
            where: { id },
            data: { isTfaEnabled: true }
        });
    }

    async disable2fa(id: string) {
        const user = await this.findById(id);
        if (!user)
            throw new ForbiddenException('user not found')
        if (user.isTfaEnabled === false)
            return new Error('2fa already disabled');
        
        return await this._prismaS.user.update({
            where: { id },
            data: { isTfaEnabled: false }
        });
    }

    async setTwoFactorAuthSecret(id: string, secret: string) {
        const user = await this.findById(id);
        if (user && user.tfaSecret)
            return new Error('two-factor auth secret already set');
        if (user) {
            return await this._prismaS.user.update({
                where: { id, },
                data: { tfaSecret: secret },
            });
        }
        throw new ForbiddenException('user not found');
    }

    async edit(id: string, dto: EditUserDto) {
        const user = await this._prismaS.updateUser(id, dto);

        return user;
    }
    // end User

    // friend Requests
    async sendFriendReq(snd_id: string, rcv_id: string) {
        if (await this._prismaS.reqAlreadySent(snd_id, rcv_id)
            || await this._prismaS.reqAlreadySent(rcv_id, snd_id))
            return new ForbiddenException();

        return await this._prismaS.addReq(snd_id, rcv_id);
    }

    async acceptFriendReq(snd_id: string, rcv_id: string) {
        const friend = await this._prismaS.reqAlreadySent(rcv_id, snd_id);
        if (!friend)
            throw new ForbiddenException();
        return await this._prismaS.updateReq(friend.snd_id, friend.rcv_id, {status: 'ACCEPTED'});
    }

    async declineFriendReq(snd_id: string, rcv_id: string) {
        const friend = await this._prismaS.reqAlreadySent(rcv_id, snd_id);
        if (!friend)
            throw new ForbiddenException();
        if (friend.status === 'PENDING')
            return await this._prismaS.delReq(friend.snd_id, friend.rcv_id);
        return friend;
    }


    async sentReqs(id: string) {
        return await this._prismaS.friendReq.findMany({
            where: {
                snd_id: id,
                AND: {
                    status: 'PENDING',
                }
            },
        });
    }

    async receivedReqs(id: string) {
        return await this._prismaS.friendReq.findMany({
            where: {
                rcv_id: id,
                AND: {
                    status: 'PENDING',
                },
            },
        });
    }
    // end Friend Requests

    // Friends
    async unfriend(snd_id: string, rcv_id: string) {
        const friend = await this._prismaS.reqAlreadySent(rcv_id, snd_id)
                    || await this._prismaS.reqAlreadySent(snd_id, rcv_id);
        if (!friend)
            throw new ForbiddenException();
        if (friend.status === 'ACCEPTED' || friend.status === 'BLOCKED')
            return await this._prismaS.delReq(friend.snd_id, friend.rcv_id);
        return friend;
    }

    async block(snd_id: string, rcv_id: string) {
        const friend = await this._prismaS.reqAlreadySent(rcv_id, snd_id)
                    || await this._prismaS.reqAlreadySent(snd_id, rcv_id);
        if (!friend)
            throw new ForbiddenException();
        if (friend.status === 'ACCEPTED')
            return await this._prismaS.updateReq(friend.snd_id, friend.rcv_id, {snd_id, rcv_id, status: 'BLOCKED'});
        return friend;
    }

    async unblock(snd_id: string, rcv_id: string) {
        const friend = await this._prismaS.reqAlreadySent(rcv_id, snd_id)
                    || await this._prismaS.reqAlreadySent(snd_id, rcv_id);
        if (!friend)
            throw new ForbiddenException();
        if (friend.status === 'BLOCKED' && friend.snd_id === snd_id)
            return await this._prismaS.updateReq(friend.snd_id, friend.rcv_id, {status: 'ACCEPTED'});
        return friend;
    }


    async list(id: string) {
        return await this._prismaS.friendReq.findMany({
            where: {
                OR: [
                    {snd_id: id,},
                    {rcv_id: id},
                ],
                NOT: {
                    status: 'PENDING',
                }
            },
        });
    }
    // end Friends
}
