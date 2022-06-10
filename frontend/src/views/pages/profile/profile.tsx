import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/navbar/navbar";
import { FriendsManager } from "./friends_manager/friends_manager";
import { ProfileInfos } from "./profile_infos/profile_infos";
import {faUserSlash, faUserCheck, faUserMinus, faUserXmark, faUserPlus, faComment, faUsersGear, faHistory} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MatchesHistory } from "./matches_history/matches_history";


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
    const [switchTab, setSwitchTab] = React.useState<number>(0);

    const tabs = [
        {
            title: "Matches History",
            icon: faHistory,
        },
        {
            title: "Friends Manager",
            icon: faUsersGear,
        }
    ];
    return (
    <main id="profilePage">
        <NavBar />
        <div className="profil">
            <div className='container'>
                    <div className="col col-md-11 col-lg-9 col-xl-8">
                        <ProfileInfos avatar="https://avatars.githubusercontent.com/u/74456446?v=4" fullName="Walid Ben Said" username="wben-sai" ranking={2} wins={10}/>
                    </div>
                    <div className="col col-md-11 col-lg-9 col-xl-8">
                        <nav className="profileTabs">
                            <ul className="tabs">
                                {tabs.map((tab, index) => (
                                    <li className={"tabTitle "+(switchTab === index ? "active" : "")} onClick={() =>  setSwitchTab(index)}>{tab.title}</li>
                                ))}
                            </ul>
                        </nav>
                        <div className="tabHeader">
                            <hr/>
                            <div className="title">
                                {tabs.map((tab, index) => {
                                    if (index === switchTab) {
                                        return <>
                                            <FontAwesomeIcon icon={tab.icon} />
                                            <span>{tab.title}</span>
                                        </>
                                    }
                                })}
                                {/* <FontAwesomeIcon icon={faHistory} />
                                <span>Matches History</span> */}
                            </div>
                            <hr/>
                        </div>
                        {switchTab === 0 && <MatchesHistory />}
                        {switchTab === 1 && <FriendsManager />}
                    </div>
                </div>
        </div>
    </main>
    );
}