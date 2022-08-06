import React, { useState } from "react";
import { MatchCard } from "views/components/match_card/match_card";
import { GameView } from "views/pages/game_player/game_view/game_view";

export const GamePlayer:React.FC<{ultimateGame: boolean}> = ({ultimateGame}) =>  {

    return (
        <main id="gamePage" className="container">
            {/* <MatchCard /> */}
            <GameView />
        </main>
    );
}