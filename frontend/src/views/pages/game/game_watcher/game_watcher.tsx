import { faChevronCircleLeft, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    const [viewers, setViewers] = useState<number>(0);

    const updateMatche  = async () => {
        try {
            const _matchs: Array<Match> = await get_ongoing_matchs();
            setMatchs(_matchs);
        } catch(e: any) {}
    };
    useEffect(() => {
        updateMatche();
    },[]);

    useEffect(() => {
        socket.disconnect();
        updateMatche();
        socket.removeAllListeners();
        socket.connect();
    },[currentMatch]);

    useEffect(() => {
        socket.on("matchWinner", (win) => {
            setWinner(win);
        }).on("vues", (vues) => {
            setViewers(vues);
        }).on("updateScore", (score) => {
            setMatchs(oldMatches => oldMatches.map((m, i) => {
                if (i === currentMatch)
                    return {...m, score: {p1: score.score1, p2: score.score2}};
                return m;
            }));
        }).on("leaveTheGame", () => {
            if (ongoingMatchs.length > 1)
                setCurrentMatch(curr => curr + 1);
            else
                updateMatche();
        }).on("joinStream", ({p1, p2, score1, score2}) => {
            setMatchs(oldMatches => oldMatches.map((m, i) => {
                if (i === currentMatch)
                    return {...m, p1: p1, p2: p2, score: {p1: score1, p2: score2}};
                return m;
            }));
        });
    }, [socket]);

    return (
        <section id="gameWatcher" className="container">
            <div className="row">
                <div className="col-12 col-md-9">
                    {ongoingMatchs.length === 0 && <img className="noLiveGames" src={WatchEmptyState}/>}
                    {ongoingMatchs.length > 0 && <div className="navGames">
                        {ongoingMatchs.length - 1 > currentMatch && <FontAwesomeIcon icon={faChevronCircleRight} className="navButton next" title="Next game" onClick={() => setCurrentMatch((m) => m + 1)}/>}
                        <MatchCard match={ongoingMatchs[currentMatch]} winnerId={winner} viewers={viewers}/>
                        {currentMatch > 0 && <FontAwesomeIcon icon={faChevronCircleLeft} className="navButton" title="Previous game"  onClick={() => setCurrentMatch((m) => m - 1)}/>}
                    </div>}
                    {ongoingMatchs.length > 0 && <GameView gameSocket={socket} watcher={true} roomId={ongoingMatchs[currentMatch]?.id}/>}
                </div>
            </div>
        </section>
    );
}