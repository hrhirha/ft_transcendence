import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) {}

    async edit(email: string, dto: EditUserDto) {
        const user = await this.prisma.user.update({
            where: {
                email,
            },
            data: {
                ...dto,
            }
        });

        const {id, ...rest} = user;

        console.log({rest});
        return rest;
    }

}
