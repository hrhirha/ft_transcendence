import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService
{
    constructor (private _prisma: PrismaService) {}

    async leaderboard()
    {
        return await this._prisma.user.findMany({
            orderBy: [
                    { score: 'desc', },
                    { createdAt: 'asc', }
            ],
            select: {
                id: true,
                username: true,
                fullName: true,
                imageUrl: true,
                score: true,
            }
        });
    }

    async matchHistory(user: User)
    {
        const games = await this._prisma.game.findMany({
            where: {
                user_game: {
                    some: {
                        uid: user.id
                    }
                }
            },
            select: {
                id: true,
                map: true,
                is_ultimate: true,
                user_game: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                imageUrl: true,
                            }
                        },
                        score: true,
                    }
                }
            }
        });

        let hist = [];
        games.forEach(game => {
            const p1 = game.user_game[0].user;
            p1["score"] = game.user_game[0].score;
            const p2 = game.user_game[1].user;
            p2["score"] = game.user_game[1].score;

            delete game.user_game;
            hist.push({ ...game , p1, p2 });
        });
        return hist;
    }
}
