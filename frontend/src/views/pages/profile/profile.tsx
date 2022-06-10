import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/navbar/navbar";
import { FriendsManager } from "./friends_manager/friends_manager";
import { ProfileInfos } from "./profile_infos/profile_infos";
import {faUserSlash, faUserCheck, faUserMinus, faUserXmark, faUserPlus, faComment} from "@fortawesome/free-solid-svg-icons";


export enum userType {
    none = 0,
	friend = 1,
	request = 2,
	blocked = 3,
	pending = 4
}

export const buttons = [
    {
        type: userType.none,
        icon: faUserPlus,
        text: 'Add Friend',
        onClick: (username: string) => {
            console.log('Add Friend', username);
        }
    },
    {
        type: userType.request,
        icon: faUserCheck,
        text: 'Accept',
        onClick: (username: string) => {
            console.log('accept', username);
        }
    },
    {
        type: userType.request,
        icon: faUserXmark,
        text: 'Decline',
        onClick: (username: string) => {
            console.log('decline', username);
        }
    },
    {
        type: userType.friend,
        icon: faComment,
        text: 'Message',
        onClick: (username: string) => {
            console.log('sent message', username);
        }
    },
    {
        type: userType.friend,
        icon: faUserSlash,
        text: 'Block',
        onClick: (username: string) => {
            console.log('block', username);
        }
    },
    {
        type: userType.blocked,
        icon: faUserMinus,
        text: 'Unblock',
        onClick: (username: string) => {
            console.log('unblock', username);
        }
    },
    {
        type: userType.pending,
        icon: faUserXmark,
        text: 'Cancle',
        onClick: (username: string) => {
            console.log('cancel', username);
        }
    }
];

export const Profile:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="profilePage">
        <NavBar />
        <div className="profil">
            <div className='container'>
                    <div className="col col-md-11 col-lg-9 col-xl-8">
                        <ProfileInfos avatar="https://avatars.githubusercontent.com/u/74456446?v=4" fullName="Walid Ben Said" username="wben-sai" ranking={2} wins={10}/>
                    </div>
                    <div className="col col-md-11 col-lg-9 col-xl-8">
                        <FriendsManager />
                    </div>
                </div>
        </div>
    </main>
    );
}

 /* <div className="match_history">
    <div className="Titile">
        <FontAwesomeIcon icon={faClockRotateLeft}/>
        <h2>match history</h2>
    </div>
    <div className="matchs">
        <div className="items_match">
            { Match_data && Match_data.map (({user1, image_user1, user2, image_user2, score, status, typegame, time}, k ) => (
                <Item
                    key={k}
                    user1 = {user1}
                    image_user1 = {image_user1}
                    user2 = {user2}
                    image_user2 = {image_user2}
                    score = {score}
                    status = {status}
                    typegame = {typegame}
                    time = {time} />
            ))}
        </div>  
    </div>
</div>*/