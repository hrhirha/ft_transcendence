import { WatchEmptyState } from "assets";
import { get_ongoing_matchs, Match } from "controller/user/matchs";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MatchCard } from "views/components/match_card/match_card";
import { GameView } from "views/pages/game/game_view/game_view";

export const GameWatcher:React.FC = () =>  {
    const [socket] = useState(io("ws://127.0.0.1:3001/game", {withCredentials: true}));
    const [ongoingMatchs, setMatchs] = useState<Array<Match>>([]);
    const [winner, setWinner] = useState<string>("");
    const [currentMatch, setCurrentMatch] = useState<number>(0);
    useEffect(() => {
        (async () => {
            try {
                const _matchs: Array<Match> = await get_ongoing_matchs();
                setMatchs(_matchs);
            } catch(e: any) {}
        })();
    },[]);

    useEffect(() => {
        if (socket.connected)
        {
            socket.on("matchWinner", (win) => {
                setWinner(win);
            }).on("updateScore", (score) => {
                setMatchs(oldMatches => oldMatches.map((m, i) => {
                    if (i === currentMatch)
                    {
                        return {...m, score: {p1: score.score1, p2: score.score2}};
                    }
                    return m;
                }));
            }).on("joinStream", ({p1, p2, score1, score2}) => {
                setMatchs(oldMatches => oldMatches.map((m, i) => {
                    if (i === currentMatch)
                    {
                        return {...m, p1: p1, p2: p2, score: {p1: score1, p2: score2}};
                    }
                    return m;
                }));
            });
        }
    }, [socket]);

    return (
        <section id="gameWatcher" className="container">
            <div className="row">
                <div className="col-12 col-md-9">
                    {ongoingMatchs.length === 0 && <img className="noLiveGames" src={WatchEmptyState}/>}
                    {ongoingMatchs.length > 0 && <MatchCard match={ongoingMatchs[currentMatch]} winnerId={winner}/>}
                    {ongoingMatchs.length > 0 && <GameView gameSocket={socket} isUltimate={false} watcher={true} roomId={ongoingMatchs[currentMatch]?.id} isPrivate={false} vsPID="" />}
                </div>
            </div>
        </section>
    );
}