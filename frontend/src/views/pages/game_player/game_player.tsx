import React, { useState } from "react";
import { MatchCard } from "views/components/match_card/match_card";
import { GameView } from "views/pages/game_player/game_view/game_view";

export const GamePlayer:React.FC<{ultimateGame: boolean}> = ({ultimateGame}) =>  {

    return (
        <main id="gamePage" className="container">
            <MatchCard
                matchId="MATCH001"
                gameModePro={ultimateGame}
                player1={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=11",
                        "username": "zel-bagh",
                        "fullName": "Player1 Full Name",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=18",
                        "username": "abahdir",
                        "fullName": "Player2 FulName",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                score={{
                    "player1": 0,
                    "player2": 0
                }}
                onClick={() => {}}
                />
            <GameView />
        </main>
    );
}