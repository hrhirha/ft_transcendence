import { Match } from "controller/user/matchs";
import { userDefault, User } from "controller/user/user";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MatchCard } from "views/components/match_card/match_card";
import { GameView } from "views/pages/game/game_view/game_view";

export const GamePlayer:React.FC<{ultimateGame: boolean}> = ({ultimateGame}) =>  {
    const [socket, setSocket] = useState(io("ws://127.0.0.1:3001/game", {withCredentials: true}));
    const [matchData, setMatchData] = useState<Match>({
        is_ultimate: ultimateGame,
        p1: null,
        p2: null,
        score: {
            p1: 0,
            p2: 0
        }
    });

    useEffect(() => {
        socket.on("waiting", (players) => {
            console.log(players);

            setMatchData(oldData => ({...oldData, p1: players.p1}));
        });
        socket.on("joined", (players) => {
            console.log(players, matchData);
            setMatchData(oldData => ({...oldData, p1: players.p1, p2: players.p2}));
        });
        socket.on("updateScore", (score) => {
            console.log(score, matchData);
            setMatchData(oldData => ({...oldData, score: {p1: score.score1, p2: score.score2}}));
        });
        
    }, [socket]);
    return (
        <main id="gamePage" className="container">
            <div className="row">
                <div className="col-12 col-md-9">
                    {matchData && <MatchCard match={matchData}/>}
                    <GameView gameSocket={socket} isUltimate={ultimateGame} watcher={false} roomId={""}/>
                </div>
            </div>
        </main>
    );
}