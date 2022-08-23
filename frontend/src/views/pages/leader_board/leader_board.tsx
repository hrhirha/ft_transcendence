import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import {faClose, faMedal, faRankingStar, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { Numeral } from "views/components/numeral/numeral";
import { get_leader_board } from "controller/leader_board/leader_board";
import { useNavigate } from "react-router-dom";
import { useNotif } from "views/components/notif/notif";
import { User } from "controller/user/user";


const BoardRow:React.FC<{index: number, user: User}> = ({index, user}) => {
    const navigate = useNavigate();
    return(
    <tr id={`_${index}`} className="col-sm-12 col-8">
        <td className="rank">
            {index === 1 && <span><FontAwesomeIcon icon={faTrophy}/></span>}
            {index === 2 && <span><FontAwesomeIcon icon={faMedal}/></span>}
            {index === 3 && <span><FontAwesomeIcon icon={faMedal}/></span>}
            {index > 3 && <span><Numeral value={index} /></span>}
        </td>
        <td onClick={() => navigate(`/u/${user.username}`, {replace: true})}>
            <CircleAvatar avatarURL={user.imageUrl} dimensions={40} status={null}/>
            <span className="fullName">{user.fullName}</span>
        </td>
        <td>
            <span className="score"><Numeral value={user.score}/></span>
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
                setUsers(usersList.map((u, k) => <BoardRow key={u.id} index={k + 1} user={u}/>));
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