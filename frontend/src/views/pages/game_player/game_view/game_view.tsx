import React, { useEffect, useState } from "react";
import { io,Socket } from "socket.io-client";
import Phaser from "phaser";
import TitleScreen from "game_controller/scenes/TitleScreen";

interface Config {
    type: number;
    parent: string,
    backgroundColor: string,
    scale: {
        mode: number;
        autoCenter: number;
        width: number;
        height: number;
    };
    physics: {
        default: string;
        arcade: {
            gravity: {
                y: number;
            };
            debug: boolean;
        };
    };
}

export const GameView:React.FC = () =>  {

    useEffect(() => {
        const config: Config = {
            type: Phaser.AUTO,
            parent: "gameView",
            backgroundColor: "#000",
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 1080,
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
        const socket = io("ws://127.0.0.1:3001/game", {withCredentials: true});
        const scene: TitleScreen = new TitleScreen(socket, "normaleQue");
        game.scene.add("titlescreen", scene);
        game.scene.start("titlescreen");
    }, []);

    return (
        <section id="gameView" className="container">
        </section>
    );
}