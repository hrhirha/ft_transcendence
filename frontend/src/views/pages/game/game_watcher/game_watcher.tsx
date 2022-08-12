import React, { useState } from "react";
import { io } from "socket.io-client";
import { GameView } from "views/pages/game/game_view/game_view";

export const GameWatcher:React.FC = () =>  {
    const socket = io("ws://127.0.0.1:3001/game", {withCredentials: true});

    return (
        <section id="gameWatcher">
            
            <GameView gameSocket={socket}/>
        </section>
    );
}