import { userDefault, User } from "controller/user/user";
import React, { useState } from "react";
import { io } from "socket.io-client";
import { MatchCard } from "views/components/match_card/match_card";
import { GameView } from "views/pages/game/game_view/game_view";

export const GamePlayer:React.FC<{ultimateGame: boolean}> = ({ultimateGame}) =>  {
    const socket = io("ws://127.0.0.1:3001/game", {withCredentials: true});
    const [RP, setRP] = useState<User>(userDefault);
    const [LP, setLP] = useState<User>(userDefault);
    const [score, setScore] = useState<{lp: number, rp: number}>({lp: 0, rp: 0});

    socket.on("score_change", () => {
         
    });
    return (
        <main id="gamePage" className="container">
<<<<<<< HEAD
            {/* <MatchCard
                matchId="MATCH001"
                gameModePro={ultimateGame}
                player1={RP}
                player2={LP}
                score={{
                    "player1": score.rp,
                    "player2": score.lp
                }}
                onClick={() => {}}
                /> */}
            <GameView gameSocket={socket} isUltimate={true} watcher={false} roomId={""}/>
=======
            <div className="row">
                <div className="col-12 col-md-9">
                    {/* <MatchCard
                        matchId="MATCH001"
                        gameModePro={ultimateGame}
                        player1={RP}
                        player2={LP}
                        score={{
                            "player1": score.rp,
                            "player2": score.lp
                        }}
                        onClick={() => {}}
                        /> */}
                    <GameView gameSocket={socket} isUltimate={ultimateGame} watcher={false} roomId={""}/>
                </div>
            </div>
>>>>>>> b29102ed624d1305079659604206dbd943614bc3
        </main>
    );
}