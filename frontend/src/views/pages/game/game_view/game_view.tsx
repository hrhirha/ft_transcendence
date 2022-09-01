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

export const GameView:React.FC<{gameSocket: Socket, isUltimate?: boolean, watcher?: boolean, roomId: string}> = ({gameSocket, isUltimate, watcher, roomId}) => {
    const [game, setGame] = useState<Phaser.Game>();
    const setNewGame = () =>  setGame(() => {
        const newGame = new Phaser.Game(config);
        let privateGame : {userId: string} = null;

        if (JSON.parse(window.localStorage.getItem("privateGame")) !== null) {
            privateGame = JSON.parse(window.localStorage.getItem("privateGame"));
            window.localStorage.removeItem("privateGame");
        }
        newGame.scene.add("PingPong",
            new PingPong(gameSocket, isUltimate === null ? "" : (isUltimate ? "ultimateQue" : "normaleQue"),
            watcher === null ? true : !watcher,
            roomId,
            {private: privateGame !== null, userId: privateGame !== null ? privateGame.userId : ""}));
        newGame.scene.start("PingPong");
        return newGame;
    });
    useEffect(() => {
        setNewGame();
    }, []);
    useEffect(() => {
        if (game) {
            game.destroy(true);
            setNewGame();
        }
    }, [roomId]);
    return (
        <section id="gameView"></section>
    );
}