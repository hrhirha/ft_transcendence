import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    // User
    async edit(id: string, dto: EditUserDto) {
        const user = await this.prisma.updateUser(id, dto);

        console.log({user});
        return ;
    }
    // end User

    // friend Requests
    async sendFriendReq(snd_id: string, rcv_id: string) {
        if (await this.prisma.reqAlreadySent(snd_id, rcv_id)
            || await this.prisma.reqAlreadySent(rcv_id, snd_id))
            return new ForbiddenException();

        return await this.prisma.addReq(snd_id, rcv_id);
    }

    async acceptFriendReq(snd_id: string, rcv_id: string) {
        const friend = await this.prisma.reqAlreadySent(rcv_id, snd_id);
        if (!friend)
            throw new ForbiddenException();
        return await this.prisma.updateReq(friend.snd_id, friend.rcv_id, {status: 'ACCEPTED'});
    }

    async declineFriendReq(snd_id: string, rcv_id: string) {
        const friend = await this.prisma.reqAlreadySent(rcv_id, snd_id);
        if (!friend)
            throw new ForbiddenException();
        if (friend.status === 'PENDING')
            return await this.prisma.delReq(friend.snd_id, friend.rcv_id);
        return friend;
    }


    async sentReqs(id: string) {
        return await this.prisma.friendReq.findMany({
            where: {
                snd_id: id,
                AND: {
                    status: 'PENDING',
                }
            },
        });
    }

    async receivedReqs(id: string) {
        return await this.prisma.friendReq.findMany({
            where: {
                rcv_id: id,
                AND: {
                    status: 'PENDING',
                }
            },
        });
    }
    // end Friend Requests

    // Friends
    async unfriend(snd_id: string, rcv_id: string) {
        const friend = await this.prisma.reqAlreadySent(rcv_id, snd_id)
                    || await this.prisma.reqAlreadySent(snd_id, rcv_id);
        if (!friend)
            throw new ForbiddenException();
        if (friend.status === 'ACCEPTED' || friend.status === 'BLOCKED')
            return await this.prisma.delReq(friend.snd_id, friend.rcv_id);
        return friend;
    }

    async block(snd_id: string, rcv_id: string) {
        const friend = await this.prisma.reqAlreadySent(rcv_id, snd_id)
                    || await this.prisma.reqAlreadySent(snd_id, rcv_id);
        if (!friend)
            throw new ForbiddenException();
        if (friend.status === 'ACCEPTED')
            return await this.prisma.updateReq(friend.snd_id, friend.rcv_id, {snd_id, rcv_id, status: 'BLOCKED'});
        return friend;
    }

    async unblock(snd_id: string, rcv_id: string) {
        const friend = await this.prisma.reqAlreadySent(rcv_id, snd_id)
                    || await this.prisma.reqAlreadySent(snd_id, rcv_id);
        if (!friend)
            throw new ForbiddenException();
        if (friend.status === 'BLOCKED' && friend.snd_id === snd_id)
            return await this.prisma.updateReq(friend.snd_id, friend.rcv_id, {status: 'ACCEPTED'});
        return friend;
    }


    async list(id: string) {
        return await this.prisma.friendReq.findMany({
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
