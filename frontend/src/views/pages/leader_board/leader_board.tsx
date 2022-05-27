import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/navbar/navbar";
import {faMedal, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { CircleAvatar } from "../../components/circle_avatar/circle_avatar";

interface RowProps {
    rank: number,
    avatar: string,
    fullname: string,
    score: number
}

const BoardRow:React.FC<RowProps> = (RowProps) => {
    return(
    <tr id={RowProps.rank.toString()} className="col-sm-12 col-8">
        <td className="rank">
            {RowProps.rank == 1 && <span className="firstPlace"><FontAwesomeIcon icon={faTrophy}/></span>}
            {RowProps.rank == 2 && <span className="secondPlace"><FontAwesomeIcon icon={faMedal}/></span>}
            {RowProps.rank == 3 && <span className="thirdPlace"><FontAwesomeIcon icon={faMedal}/></span>}
            {RowProps.rank > 3 && <span className="ranking">{RowProps.rank}</span>}
        </td>
        <td>
            <CircleAvatar avatarURL={RowProps.avatar} dimensions={40}/>
            <span className="fullName">{RowProps.fullname}</span>
        </td>
        <td>
            <span className="score">{RowProps.score}</span>
        </td>
    </tr>);
}

export const LeaderBoard:React.FC = () => {
    const navigate = useNavigate();
    let users = [];

    for (let i = 0; i < 100; i++)
        users.push(<BoardRow key={i} rank={i + 1} avatar="https://i.stack.imgur.com/AVJwP.png" fullname="Jhon Doe" score={500 - i * 2}/>);
    return (
    <main id="leaderBoardPage">
        <NavBar />
        <div className='container'>
            <table className="row">
                <thead>
                    <tr>
                        <th>#Rank</th>
                        <th>Player Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(e => e)}
                </tbody>
            </table>
        </div>
    </main>
    );
}