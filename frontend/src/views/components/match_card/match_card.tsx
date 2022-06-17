import React from "react";
import { DefaultGame, UltimateGame } from "../../../assets";
import { CircleAvatar } from "../circle_avatar/circle_avatar";

interface Player {
    avatar: string;
    fullName: string;
    ranking: number;
    score: number;
}

interface Props {
    matchId: string;
    gameModePro: boolean;
    player1: Player;
    player2: Player;
    onClick: Function;
}

export const MatchCard:React.FC<Props> = (Props) => {
    return (
    <section className="matchCard" id={Props.matchId}>
        <div className="player">
            <div className="avatar">
                <CircleAvatar avatarURL={Props.player1.avatar} dimensions={60} showStatus={false}/>
                <span className="ranking">{Props.player1.ranking}</span>
            </div>
            <h6 className="fullName">{Props.player1.fullName}</h6>
        </div>
        <div className="scoreBoard">
            <span className="score">{Props.player1.score}</span>
            <img className="gameType" src={Props.gameModePro ? UltimateGame : DefaultGame} alt="Game Type"/>
            <span className="score">{Props.player2.score}</span>
        </div>
        <div className="player">
            <h6 className="fullName">{Props.player2.fullName}</h6>
            <div className="avatar">
                <CircleAvatar avatarURL={Props.player2.avatar} dimensions={60} showStatus={false}/>
                <span className="ranking">{Props.player2.ranking}</span>
            </div>
        </div>
    </section>
    );
}