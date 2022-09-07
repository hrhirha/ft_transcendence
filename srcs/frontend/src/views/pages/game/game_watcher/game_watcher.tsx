import { faChevronCircleLeft, faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WatchEmptyState } from "assets";
import { get_ongoing_matchs, Match } from "controller/user/matchs";
import { env, game_socket } from "index";
import React, { useEffect, useRef, useState } from "react";
import { MatchCard } from "views/components/match_card/match_card";
import { GameView } from "../game_view/game_view";

export const GameWatcher:React.FC = () =>  {
    const [ongoingMatchs, setMatchs] = useState<Array<Match>>([]);
    const [winner, setWinner] = useState<string>("");
    const currentMatchId = useRef<string>("");

    const updateMatche  = async () => {
        try {
            const _matchs: Array<Match> = await get_ongoing_matchs();
            setMatchs(_matchs);
            if (_matchs.length > 0)
            {
                const indx = _matchs.findIndex((m) => m.id === currentMatchId.current);
                currentMatchId.current = _matchs[indx === -1 ? 0 : indx].id;
            }
            else
                currentMatchId.current = "";
        } catch(e: any) {}
    };

    useEffect(() => {
        if (game_socket.disconnected)
        {
            game_socket.removeAllListeners();
            game_socket.connect();
            console.log("reconnect");
        }
    }, []);

    useEffect(() => {
        updateMatche();
        game_socket.on("matchWinner", (win) => {
            setWinner(win);
        }).on("updateScore", (score) => {
            setMatchs(oldMatches => oldMatches.map((m) => {
                if (m.id === currentMatchId.current)
                    return {...m, score: {p1: score.score1, p2: score.score2}};
                return m;
            }));
        }).on("leaveTheGame", () => {
            setWinner("");
            updateMatche();
        })
        .on("keepWatching", (matchId: string) => {
            setWinner("");
        }).on("joinStream", ({p1, p2, score1, score2}) => {
            setMatchs(oldMatches => oldMatches.map((m) => {
                if (m.id === currentMatchId.current)
                    return {...m, p1: p1, p2: p2, score: {p1: score1, p2: score2}};
                return m;
            }));
        });
    }, [currentMatchId]);

    const nextMatch = () => {
        if (ongoingMatchs.length > 1)
        {
            const indx = ongoingMatchs.findIndex((m) => m.id === currentMatchId.current);
            if (indx === -1)
                return "";
            if (ongoingMatchs[indx + 1] !== undefined)
                currentMatchId.current = ongoingMatchs[indx + 1].id;
        }
        else
            updateMatche();
    };

    const prevMatch = () => {
        if (ongoingMatchs.length > 1)
        {
            const indx = ongoingMatchs.findIndex((m) => m.id === currentMatchId.current);
            if (indx === -1)
                return "";
            if (ongoingMatchs[indx - 1] !== undefined)
                currentMatchId.current = ongoingMatchs[indx - 1].id;
        }
        else
            updateMatche();
    };

    const showArrow = (leftArrow: boolean) => {
        if (ongoingMatchs.length > 1)
        {
            const indx = ongoingMatchs.findIndex((m) => m.id === currentMatchId.current);
            if (indx === -1)
                return false;
            if (leftArrow)
                return (ongoingMatchs[indx - 1] !== undefined);
            else
                return (ongoingMatchs[indx + 1] !== undefined);
        }
    }   

    return (
        <section id="gameWatcher" className="container">
            <div className="row">
                <div className="col-12 col-md-9">
                    {ongoingMatchs.length === 0 && <img className="noLiveGames" src={WatchEmptyState}/>}
                    {ongoingMatchs.length > 0 && <div className="navGames">
                        {showArrow(false) && <FontAwesomeIcon icon={faChevronCircleRight} className="navButton next" title="Next game" onClick={() => nextMatch()}/>}
                        <MatchCard match={ongoingMatchs.find((m) => m.id === currentMatchId.current)} winnerId={winner} showViewrs={true}/>
                        {showArrow(true) &&  <FontAwesomeIcon icon={faChevronCircleLeft} className="navButton" title="Previous game"  onClick={() => prevMatch()}/>}
                    </div>}
                    {ongoingMatchs.length > 0 && <GameView gameSocket={game_socket} watcher={true} roomId={currentMatchId.current}/>}
                </div>
            </div>
        </section>
    );
}