import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { prisma, PrismaClient } from '@prisma/client';
import { EditUserDto } from 'src/user/dto';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: { url: config.get('DATABASE_URL'), },
            },
        });
    }

    // update user info [username, avatar]
    async updateUser(id: string, dto: EditUserDto) {
        const user = await this.user.update({
            where: {
                id,
            },
            data: {
                ...dto,
            }
        });
        return user;
    }

    // a friendReq is already sent by user with id 'snd_id'
    async reqAlreadySent(snd_id: string, rcv_id: string) {
        const freq = await this.friendReq.findUnique({
            where: {
                snd_id_rcv_id: {
                    snd_id,
                    rcv_id,
                },
            },
        });
        return freq;
    }

    // create a new friendReq record
    async addReq(snd_id: string, rcv_id: string) {
        // if (snd_id === rcv_id)
        //     throw new ForbiddenException();
        const freq = await this.friendReq.create({
            data: {
                snd_id,
                rcv_id,
                status: 'PENDING',
            },
        });
        return freq;
    }

    // update friendReq record's status ['PENDING', 'ACCEPTED', 'BLOCKED']
    async updateReq(snd_id: string, rcv_id:string, rec: {snd_id?: string, rcv_id?: string, status: string}) {
        // if (snd_id === rcv_id)
        //     throw new ForbiddenException();
        return await this.friendReq.update({
            where: {
                snd_id_rcv_id: {
                    snd_id,
                    rcv_id,
                },
            },
            data: {
                ...rec,
            }
        });
    }

    // delete a friendReq record if it exists and status=='ACCEPTED'
    async delReq(snd_id: string, rcv_id: string) {
        const del = await this.friendReq.delete({
            where: {
                snd_id_rcv_id: {
                    snd_id,
                    rcv_id,
                },
            },
        });
        return del;
    }

    // get all pending requests
    async getPendingReqs() {}

    // get all recieved requests
    async getReceivedReqs() {}
}
