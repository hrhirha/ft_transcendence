import React from "react";
import { DefaultGame, UltimateGame } from "assets";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { useNavigate } from "react-router-dom";
import { User } from "controller/user/user";

interface Props {
    matchId: string;
    gameModePro: boolean;
    player1: User;
    player2: User;
    onClick: Function;
    score: {
        player1: number,
        player2: number
    };
}

export const MatchCard:React.FC<Props> = (Props) => {
    const navigate = useNavigate();
    return (
    <section className="matchCard" id={Props.matchId}>
        <div className="player" onClick={() => navigate(`/u/${Props.player1.username}`)}>
            <div className="avatar">
                <CircleAvatar avatarURL={Props.player1.imageUrl} dimensions={60} showStatus={false}/>
                <span className="achievment" title={Props.player1.rank.title}>
                    <img src={Props.player1.rank.icon} alt={Props.player1.rank.title}/>
                </span>
            </div>
            <h6 className="fullName">{Props.player1.fullName}</h6>
        </div>
        <div className="scoreBoard">
            <span className="score">{Props.score.player1}</span>
            <img className="gameType" src={Props.gameModePro ? UltimateGame : DefaultGame} alt="Game Type"/>
            <span className="score">{Props.score.player2}</span>
        </div>
        <div className="player" onClick={() => navigate(`/u/${Props.player2.username}`)}>
            <h6 className="fullName">{Props.player2.fullName}</h6>
            <div className="avatar">
                <CircleAvatar avatarURL={Props.player2.imageUrl} dimensions={60} showStatus={false}/>
                <span className="achievment" title={Props.player2.rank.title}>
                    <img src={Props.player2.rank.icon} alt={Props.player2.rank.title}/>
                </span>
            </div>
        </div>
    </section>
    );
}