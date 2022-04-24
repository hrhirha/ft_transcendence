import { Get, Injectable, Redirect } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/user/dto';

@Injectable()
export class AuthService {

    constructor(private config: ConfigService, private jwt: JwtService, private prisma: PrismaService) {}

    async redirect(dto: UserDto) {

        let user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        });
        if (!user) {
            user = await this.prisma.user.create({ data: { ...dto, } });
        }

        const payload = {
            sub: user.id,
            email: user.email,
        };
        const secret = this.config.get('JWT_ACCESS_SECRET');
        const options = { secret,  };
        // const access_token = await this.jwt.signAsync(payload, options);
        const access_token = this.jwt.sign(payload, options);
        return {access_token,}
    }
}
