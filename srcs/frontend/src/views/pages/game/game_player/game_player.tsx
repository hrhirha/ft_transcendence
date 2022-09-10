import { faGamepad, faLeaf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Match } from "controller/user/matchs";
import { env, game_socket, history } from "index";
import React, { useEffect, useRef, useState } from "react";
import { MatchCard } from "views/components/match_card/match_card";
import { useNotif } from "views/components/notif/notif";
import { GameView } from "views/pages/game/game_view/game_view";

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

        if (game_socket.disconnected)
        {
            console.log("Reconnect The Game Socket");
            game_socket.removeAllListeners();
            game_socket.connect();
        }
        const unblock = history.block((tx) => {
            pushNotif({
                id: "LEAVEGAME",
                type: "info",
                time: 15000,
                icon: <FontAwesomeIcon icon={faGamepad}/>,
                title: "Confirmation",
                description: "Are you sure you want to leave the game?",
                actions: [
                    {title: "Cancel", color: "#6970d4", action: () => {
                    }},
                    {title: "Leave the game", color: "#313348", action: () => {
                        game_socket.disconnect();
                        unblock();
                        tx.retry();
                    }}
                ] 
            });
        });
        window.addEventListener("visibilitychange", event => {
            game_socket.emit("isActive", (document.visibilityState === "visible"));
        });
        game_socket.on("matchWinner", (win) => {
            setWinner(win);
        })
        .on("keepWatching", () => {
            setWinner("");
        }).on("leaveTheGame", () => {
            setWinner("");
        })
        .on("updateScore", (score) => {
            setMatchData(oldData => ({...oldData, score: {p1: score.score1, p2: score.score2}}));
        }).on("waiting", (players) => {
            setMatchData({
                is_ultimate: ultimateGame,
                p1: null,
                p2: null,
                score: {
                    p1: 0,
                    p2: 0
                }
            });
            setMatchData(oldData => ({...oldData, p1: players.p1}));
        }).on("joined", (players) => {
            setMatchData(oldData => ({...oldData, p1: players.p1, p2: players.p2}));
        });
    }, []);

    return (
        <main id="gamePage" className="container">
            <div className="row">
                <div className="col-12 col-md-9">
                    {matchData && <MatchCard match={matchData} winnerId={winner} showViewrs={true}/>}
                    <GameView
                        gameSocket={game_socket}
                        isUltimate={ultimateGame}
                        watcher={false}
                        roomId={""}
                    />
                </div>
            </div>
        </main>
    );
}