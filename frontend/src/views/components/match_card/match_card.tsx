import React, { useEffect, useState } from "react";
import { DefaultGame, UltimateGame, WinnerCrown } from "assets";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { useNavigate } from "react-router-dom";
import { Match } from "controller/user/matchs";
import { User } from "controller/user/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Numeral } from "../numeral/numeral";
import { game_socket } from "index";

const PlayerData:React.FC<{player: User, left: boolean, winner: boolean}> = ({player, left, winner}) => {
    const navigate = useNavigate();
    if (player === null)
        return (<div className={`loadinPlayer ${left ? "left" : "right"}`}>
            {!left && <h6 className="fullName">waiting ...</h6>}
            <div className="avatar"></div>
            {left && <h6 className="fullName">waiting ...</h6>}
        </div>);
    return (
        <div className={`player ${left ? "left" : "right"}`} onClick={() => navigate(`/u/${player.username}`)}>
            {!left && <h6 className="fullName">{player.fullName}</h6>}
            <div className={`avatar ${winner ? "winner" : ""}`}>
                {winner && <img src={WinnerCrown} alt="winner" className="winner_crown"/>}
                <CircleAvatar avatarURL={player.imageUrl} dimensions={60} status = {null}/>
                <span className="achievment" title={player.rank.title}>
                    <img src={player.rank.icon} alt={player.rank.title}/>
                </span>
            </div>
            {left && <h6 className="fullName">{player.fullName}</h6>}
        </div>
    );
}

export const MatchCard:React.FC<{match: Match, winnerId?: string, showViewrs?: boolean}> = ({match, winnerId, showViewrs = false}) => {
    const [viewers, setViewers] = useState<number>(0);

    useEffect(() => {
        game_socket.on("vues", (vues: number) => {
            setViewers(vues);
        })
    }, []);

    return (
    <section className="matchCard" id={match.id}>

        <PlayerData player={match.p1} left={true} winner={winnerId && match.p1.id === winnerId}/>
        <div className="scoreBoard">
            <span className="score">{match.score.p1}</span>
            
            {showViewrs && <span className="viewers">
                <FontAwesomeIcon icon={faEye}/>
                <Numeral value={viewers}/>
            </span>}
            <img className="gameType" src={match.is_ultimate ? UltimateGame : DefaultGame} alt="Game Type"/>
            <span className="score">{match.score.p2}</span>
        </div>
        <PlayerData player={match.p2} left={false} winner={winnerId && match.p2.id === winnerId}/>
    </section>
    );
}