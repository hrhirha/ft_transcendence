import React, { useEffect, useState } from "react";
import { io,Socket } from "socket.io-client";
import Phaser from "phaser";
import PingPong from "game_controller/pingpong";

export const GameView:React.FC = () =>  {

    useEffect(() => {
        const sock: Socket = io("ws://127.0.0.1:3001/game", {withCredentials: false});
        const scene: PingPong = new PingPong(sock, "normaleQue");
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "gameView",
            width: 1280,
            height: 720,
            backgroundColor: "#62679b",
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
                    debug: false
                }
            }
        }
        const game: Phaser.Game = new Phaser.Game(config);
        game.scene.add("PingPong", scene);
        game.scene.start("PingPong");
    }, []);

    return (
        <section id="gameView"></section>
    );
}