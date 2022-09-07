import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from 'src/user/dto';

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

    async matchHistory(username: string)
    {
        const games = await this._prisma.game.findMany({
            where: {
                user_game: {
                    some: {
                        user: { username }
                    }
                },
                ongoing: false,
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
                                score: true,
                                rank: {
                                    select: {
                                        title: true,
                                        icon: true,
                                        field: true,
                                    }
                                },
                                wins: true,
                                loses: true,
                                status: true,
                            }
                        },
                        score: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        let hist = [];
        games.forEach(game => {
            const ug1 = game.user_game[0];
            const ug2 = game.user_game[1];
            const p1 = ug1.user;
            const p2 = ug2.user;

            game['score'] = { p1: ug1.score, p2: ug2.score }

            delete game.user_game;
            
            hist.push({ ...game , p1, p2 });
        });
        return hist;
    }

    async ongoingGames(user: UserDto)
    {
        const games = await this._prisma.game.findMany({
            where: {
                ongoing: true,
                user_game: {
                    none: {
                        uid: user.id,
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
                                score: true,
                                rank: {
                                    select: {
                                        title: true,
                                        icon: true,
                                        field: true,
                                    }
                                },
                                wins: true,
                                loses: true,
                                status: true,
                            }
                        },
                        score: true,
                    }
                }
            }
        });

        let hist = [];
        games.forEach(game => {
            const ug1 = game.user_game[0];
            const ug2 = game.user_game[1];
            const p1 = ug1.user;
            const p2 = ug2.user;

            game['score'] = { p1: ug1.score, p2: ug2.score }

            delete game.user_game;

            hist.push({ ...game , p1, p2 });
        });
        return hist;
    }
}
