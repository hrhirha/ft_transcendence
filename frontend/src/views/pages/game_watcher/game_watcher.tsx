import React, { useState } from "react";
import { GameView } from "../game_player/game_view/game_view";

export const GameWatcher:React.FC = () =>  {

    return (
        <section id="gameWatcher">
            <GameView />
        </section>
    );
}