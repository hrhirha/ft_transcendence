import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import {  } from 'src/user/dto';
import { friend_status } from 'src/utils';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        const db_name = process.env.DB_NAME;
        const db_username = process.env.DB_USERNAME;
        const db_password = process.env.DB_PASSWORD;
        const db_port = process.env.DB_PORT;
        const db_host = process.env.DB_HOST
        const url = `postgresql://${db_username}:${db_password}@${db_host}:${db_port}/${db_name}?schema=public`
        console.log({url});
        super({
            datasources: {
                db: { url } // : process.env.DATABASE_URL},
            },
        });
    }
}
