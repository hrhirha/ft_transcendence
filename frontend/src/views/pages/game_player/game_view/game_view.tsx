import React, { useEffect, useState } from "react";
import { io,Socket } from "socket.io-client";
import Phaser from "phaser";
import PingPong from "game_controller/pingpong";

export const GameView:React.FC = () =>  {

    useEffect(() => {
        const sock: Socket = io("ws://10.11.3.3:3001/game", {withCredentials: false});
        const scene: PingPong = new PingPong(sock, "normaleQue");
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "gameView",
            backgroundColor: "#000",
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1280,
                height: 720,
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: true
                }
            }
        }
        const game: Phaser.Game = new Phaser.Game(config);
        game.scene.add("PingPong", scene);
        game.scene.start("PingPong");
    }, []);

    return (
        <section id="gameView" className="container">
        </section>
    );
}