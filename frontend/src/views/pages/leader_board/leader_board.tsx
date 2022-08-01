import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {faClose, faMedal, faRankingStar, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { CircleAvatar } from "../../components/circle_avatar/circle_avatar";
import { Numeral } from "../../components/numeral/numeral";
import { get_leader_board } from "../../../controller/leader_board/leader_board";
import { useNavigate } from "react-router-dom";
import { useNotif } from "../../components/notif/notif";

interface RowProps {
    rank: number,
    username: string,
    avatar: string,
    fullname: string,
    score: number
}

const BoardRow:React.FC<RowProps> = (RowProps) => {
    const navigate = useNavigate();
    return(
    <tr id={"_"+RowProps.rank} className="col-sm-12 col-8">
        <td className="rank">
            {RowProps.rank === 1 && <span><FontAwesomeIcon icon={faTrophy}/></span>}
            {RowProps.rank === 2 && <span><FontAwesomeIcon icon={faMedal}/></span>}
            {RowProps.rank === 3 && <span><FontAwesomeIcon icon={faMedal}/></span>}
            {RowProps.rank > 3 && <span><Numeral value={RowProps.rank} /></span>}
        </td>
        <td onClick={() => navigate(`/u/${RowProps.username}`)}>
            <CircleAvatar avatarURL={RowProps.avatar} dimensions={40} showStatus={false}/>
            <span className="fullName">{RowProps.fullname}</span>
        </td>
        <td>
            <span className="score"><Numeral value={RowProps.score}/></span>
        </td>
    </tr>);
}

export const LeaderBoard:React.FC = () => {
    const [users, setUsers] = useState<Array<any>>();
    const pushNotif = useNotif();

    useEffect(() => {
        (async () => {
            try {
                const usersList: Array<any> = await get_leader_board();
                setUsers(usersList.map((u, k) => <BoardRow key={u.id} rank={k + 1} username={u.username} avatar={u.imageUrl} fullname={u.fullName} score={u.score}/>));
            }
            catch(e: any) {
                pushNotif({
                    id: "GETLEADERBOARDERROR",
                    type: "error",
                    icon: <FontAwesomeIcon icon={faClose}/>,
                    title: "ERROR",
                    description: e.message 
                });
            }
        })();
    }, []);
    return (
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
                        {users && users.map(e => e)}
                    </tbody>
                </table>
            </div>
        </main>
    );
}