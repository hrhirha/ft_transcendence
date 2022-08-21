import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import Phaser from "phaser";
import PingPong from "controller/game/pingpong";

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

export const GameView:React.FC<{gameSocket: Socket, isUltimate: boolean, watcher: boolean, roomId: string, isPrivate: boolean, vsPID: string}> = ({gameSocket, isUltimate, watcher, roomId, isPrivate, vsPID}) => {
    useEffect(() => {
        const game: Phaser.Game = new Phaser.Game(config);
        game.scene.add("PingPong",new PingPong(gameSocket, isUltimate ? "ultimateQue" : "normaleQue", !watcher, roomId, {private: isPrivate, userId: vsPID}));
        game.scene.start("PingPong");
    }, []);
    return (
        <section id="gameView"></section>
    );
}