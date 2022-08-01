import React, { useState } from "react";
import { MatchCard } from "../../components/match_card/match_card";
import { GameView } from "./game_view/game_view";

export const GamePlayer:React.FC<{ultimateGame: boolean}> = ({ultimateGame}) =>  {

    return (
        <main id="gamePage">
            {/* <MatchCard /> */}
            <GameView />
        </main>
    );
}