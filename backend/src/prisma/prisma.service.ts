import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { EditUserDto } from 'src/user/dto';
import { friend_status } from 'src/utils';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        // const db_name = process.env.DB_NAME;
        // const db_username = process.env.DB_USERNAME;
        // const db_password = process.env.DB_PASSWORD;
        // const db_port = process.env.DB_PORT;
        // const db_host = process.env.DB_HOST
        // const url = `postgresql://${db_username}:${db_password}@${db_host}:${db_port}/${db_name}?schema=public`
        super({
            datasources: {
                db: { url : process.env.DATABASE_URL},
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
                status: friend_status.PENDING,
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

}
