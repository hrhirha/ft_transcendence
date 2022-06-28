import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Jwt2FAAuthGuard } from 'src/auth/guard/jwt-2fa-auth.guard';
import { GetUser } from 'src/user/decorator';
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

    @Get('match_history')
    async matchHistory(@GetUser() user: User)
    {
        try
        {
            return await this._game.matchHistory(user);
        }
        catch (e)
        {
            console.log({code: e.code, message: e.message});
            throw new ForbiddenException('unable to get your match history');
        }
    }
}
