import React from "react";
import { DefaultGame, UltimateGame } from "assets";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { useNavigate } from "react-router-dom";
import { Match } from "controller/user/matches";

export const MatchCard:React.FC<{match: Match}> = ({match}) => {
    const navigate = useNavigate();
    return (
    <section className="matchCard" id={match.id}>
        <div className="player" onClick={() => navigate(`/u/${match.p1.username}`)}>
            <div className="avatar">
                <CircleAvatar avatarURL={match.p1.imageUrl} dimensions={60} showStatus={false}/>
                <span className="achievment" title={match.p1.rank.title}>
                    <img src={match.p1.rank.icon} alt={match.p1.rank.title}/>
                </span>
            </div>
            <h6 className="fullName">{match.p1.fullName}</h6>
        </div>
        <div className="scoreBoard">
            <span className="score">{match.score.p1}</span>
            <img className="gameType" src={match.is_ultimate ? UltimateGame : DefaultGame} alt="Game Type"/>
            <span className="score">{match.score.p2}</span>
        </div>
        <div className="player" onClick={() => navigate(`/u/${match.p1.username}`)}>
            <h6 className="fullName">{match.p1.fullName}</h6>
            <div className="avatar">
                <CircleAvatar avatarURL={match.p1.imageUrl} dimensions={60} showStatus={false}/>
                <span className="achievment" title={match.p1.rank.title}>
                    <img src={match.p1.rank.icon} alt={match.p1.rank.title}/>
                </span>
            </div>
        </div>
    </section>
    );
}