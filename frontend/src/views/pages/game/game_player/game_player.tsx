import { faGamepad, faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Match } from "controller/user/matchs";
import { history } from "index";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MatchCard } from "views/components/match_card/match_card";
import { useNotif } from "views/components/notif/notif";
import { GameView } from "views/pages/game/game_view/game_view";

const socket = io("ws://127.0.0.1:3001/game", {withCredentials: true});

export const GamePlayer:React.FC<{ultimateGame: boolean}> = ({ultimateGame}) =>  {
    const pushNotif = useNotif();
    const [winner, setWinner] = useState<string>("");
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
        const unblock = history.block((tx) => {
            pushNotif({
                id: "LEAVEGAME",
                type: "info",
                time: 15000,
                icon: <FontAwesomeIcon icon={faGamepad}/>,
                title: "Confirmation",
                description: "Are you sure you want to leave the game?",
                actions: [
                    {title: "Cancle", color: "#6970d4", action: null},
                    {title: "Leave the game", color: "#313348", action: () => {
                        socket.disconnect();
                        unblock();
                        tx.retry();
                    }}
                ] 
            });
          });
    }, []);

    useEffect(() => {
        if (socket.connected)
        {
            socket.on("matchWinner", (win) => {
                setWinner(win);
            }).on("updateScore", (score) => {
                setMatchData(oldData => ({...oldData, score: {p1: score.score1, p2: score.score2}}));
            }).on("waiting", (players) => {
                setMatchData(oldData => ({...oldData, p1: players.p1}));
            }).on("joined", (players) => {
                console.log(players);
                setMatchData(oldData => ({...oldData, p1: players.p1, p2: players.p2}));
            });
        }
    }, [socket]);
    return (
        <main id="gamePage" className="container">
            <div className="row">
                <div className="col-12 col-md-9">
                    {matchData && <MatchCard match={matchData} winnerId={winner}/>}
                    <GameView gameSocket={socket} isUltimate={ultimateGame} watcher={false} roomId={""} isPrivate={false} vsPID="" />
                </div>
            </div>
        </main>
    );
}