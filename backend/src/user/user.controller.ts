import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { GetUser } from './decorator';
import { EditUserDto, UserDto } from './dto';
import { JwtAuthGuard } from './guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('me')
    me(@GetUser() dto: UserDto) {
        console.log({dto});
        return dto;
    }

    @Post('edit')
    edit(@GetUser('email') email: string, @Body() dto: EditUserDto) {
        return this.userService.edit(email, dto);
    }
}
