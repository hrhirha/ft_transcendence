import { Controller, ForbiddenException, Get, Param, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { GetUser } from 'src/user/decorator';
import { UserDto } from 'src/user/dto';
import { GameService } from './game.service';

@UseGuards(Jwt2FAAuthGuard)
@Controller('game')
export class GameController
{
    constructor (private _game: GameService) {}

    @Get('leaderboard')
    async leaderboard()
    {
        try
        {
            return await this._game.leaderboard();
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('unable to get leaderboard');
        }
    }

    @Get('match_history/:username')
    async matchHistory(@Param('username') username: string)
    {
        if (!(/^[\w-]{4,20}$/.test(username)))
            throw new ForbiddenException("Invalid username format");
        try
        {
            return await this._game.matchHistory(username);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('unable to get your match history');
        }
    }

    @Get('ongoing')
    async ongoingGames(@GetUser() user: UserDto)
    {
        try
        {
            return await this._game.ongoingGames(user);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('unable to get ongoing games');
        }
    }
}
