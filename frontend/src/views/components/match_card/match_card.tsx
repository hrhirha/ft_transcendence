import React from "react";
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
        <div className="player1">
            <div className="data">
                <div className="avatar">
                    <CircleAvatar avatarURL={Props.player1.avatar} dimensions={60} showStatus={false}/>
                    <p className="ranking">{Props.player1.ranking}</p>
                </div>
                <h6 className="fullName">{Props.player1.fullName}</h6>
            </div>
            <span className="score">{Props.player1.score}</span>
        </div>
    </section>
    );
}