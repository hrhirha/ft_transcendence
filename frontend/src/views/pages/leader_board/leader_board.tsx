import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {faMedal, faRankingStar, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { CircleAvatar } from "../../components/circle_avatar/circle_avatar";
import { Numeral } from "../../components/numeral/numeral";
import { AuthChecker } from "../../components/check_auth/auth_checker";

interface RowProps {
    rank: number,
    avatar: string,
    fullname: string,
    score: number
}

const BoardRow:React.FC<RowProps> = (RowProps) => {
    return(
    <tr id={"_"+RowProps.rank} className="col-sm-12 col-8">
        <td className="rank">
            {RowProps.rank === 1 && <span><FontAwesomeIcon icon={faTrophy}/></span>}
            {RowProps.rank === 2 && <span><FontAwesomeIcon icon={faMedal}/></span>}
            {RowProps.rank === 3 && <span><FontAwesomeIcon icon={faMedal}/></span>}
            {RowProps.rank > 3 && <span><Numeral value={RowProps.rank} /></span>}
        </td>
        <td>
            <CircleAvatar avatarURL={RowProps.avatar} dimensions={40} showStatus={false}/>
            <span className="fullName">{RowProps.fullname}</span>
        </td>
        <td>
            <span className="score"><Numeral value={RowProps.score}/></span>
        </td>
    </tr>);
}

export const LeaderBoard:React.FC = () => {
    let users = [];

    for (let i = 0; i < 100; i++)
        users.push(<BoardRow key={i} rank={i + 1} avatar="https://i.stack.imgur.com/AVJwP.png" fullname="Jhon Doe" score={500 - i * 2}/>);
    return (
        <AuthChecker
            redirect="/leader_board"
            wrappedContent={
            <main id="leaderBoardPage">
                <div className='container'>
                    <div className="sectionTitle">
                        <FontAwesomeIcon icon={faRankingStar}/>
                        <h2>Leader Board</h2>
                    </div>
                    <table className="col-12 col-md-8 col-xl-7">
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
            </main>}
        />
    );
}