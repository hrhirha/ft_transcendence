import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { launch } from "../../../../game_controller/main";

export const GameView:React.FC = () =>  {
    // var soc: Socket = io("http://127.0.0.1:3001/game", {withCredentials: true});

    useEffect(() => {
        launch(io("http://127.0.0.1:3001/game", {withCredentials: true}), "normaleQue");
    }, []);
    return (
        <section id="gameView" className="container">
            {/* <canvas>
                {launch(io("http://127.0.0.1:3001/game", {withCredentials: true}), "normaleQue")}
            </canvas> */}
        </section>
    );
}