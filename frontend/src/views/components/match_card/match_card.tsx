import React from "react";
import { DefaultGame, UltimateGame } from "assets";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { useNavigate } from "react-router-dom";
import { Match } from "controller/user/matchs";
import { User } from "controller/user/user";

const PlayerData:React.FC<{player: User, left: boolean}> = ({player, left}) => {
    const navigate = useNavigate();
    if (player === null)
        return (<div className="loadinPlayer">
            {!left && <h6 className="fullName"></h6>}
            <div className="avatar"></div>
            {left && <h6 className="fullName"></h6>}
        </div>);
    return (
        <div className="player" onClick={() => navigate(`/u/${player.username}`)}>
            {!left && <h6 className="fullName">{player.fullName}</h6>}
            <div className="avatar">
                <CircleAvatar avatarURL={player.imageUrl} dimensions={60} showStatus={false}/>
                <span className="achievment" title={player.rank.title}>
                    <img src={player.rank.icon} alt={player.rank.title}/>
                </span>
            </div>
            {left && <h6 className="fullName">{player.fullName}</h6>}
        </div>
    );
}

export const MatchCard:React.FC<{match: Match}> = ({match}) => {
    return (
    <section className="matchCard" id={match.id}>

        <PlayerData player={match.p1} left={true}/>
        <div className="scoreBoard">
            <span className="score">{match.score.p1}</span>
            <img className="gameType" src={match.is_ultimate ? UltimateGame : DefaultGame} alt="Game Type"/>
            <span className="score">{match.score.p2}</span>
        </div>
        <PlayerData player={match.p2} left={false}/>
    </section>
    );
}