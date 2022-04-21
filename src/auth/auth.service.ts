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
            user = await this.prisma.user.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    displayName: dto.displayName,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    profileUrl: dto.profileUrl,
                    imageUrl: dto.imageUrl,
                }
            });
        }

        const payload = {
            sub: user.id,
            email: user.email,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(
            payload,
            {
                secret,
                // expiresIn: '30s',
            }
        );
        return {access_token: token,}
    }
}
