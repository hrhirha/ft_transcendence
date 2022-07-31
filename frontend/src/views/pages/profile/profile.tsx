import React, { useEffect, useId, useState } from "react";
import { FriendsManager } from "./friends_manager/friends_manager";
import { ProfileInfos } from "./profile_infos/profile_infos";
import {faUserSlash, faUserCheck, faUserMinus, faUserXmark, faUserPlus, faUsersGear, faHistory, faBan, faHome} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MatchesHistory } from "./matches_history/matches_history";
import { post_friendreq_accept, post_friendreq_cancel, post_friendreq_decline, post_friendreq_send } from "../../../controller/user/friendreq";
import { post_friend_block, post_friend_unblock, post_friend_unfriend } from "../../../controller/user/friends";


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
        onClick: async (userId: string, action?: Function) => {
            await post_friendreq_send(userId);
        }
    },
    {
        type: userType.request,
        icon: faUserCheck,
        text: 'Accept',
        onClick: async (userId: string, action?: Function) => {
            await post_friendreq_accept(userId);
            action && action(userId);
        }
    },
    {
        type: userType.request,
        icon: faUserXmark,
        text: 'Decline',
        onClick: async (userId: string, action?: Function) => {
            await post_friendreq_decline(userId);
            action && action(userId);
        }
    },
    {
        type: userType.friend,
        icon: faUserMinus,
        text: 'Unfriend',
        onClick: async (userId: string, action?: Function) => {
            await post_friend_unfriend(userId);
            action && action(userId);
        }
    },
    {
        type: userType.friend,
        icon: faUserSlash,
        text: 'Block',
        onClick: async (userId: string, action?: Function) => {
            await post_friend_block(userId);
            action && action(userId);
        }
    },
    {
        type: userType.blocked,
        icon: faUserMinus,
        text: 'Unblock',
        onClick: async (userId: string, action?: Function) => {
            await post_friend_unblock(userId);
            action && action(userId);
        }
    },
    {
        type: userType.pending,
        icon: faUserXmark,
        text: 'Cancle',
        onClick: async (userId: string, action?: Function) => {
            await post_friendreq_cancel(userId);
            action && action(userId);
        }
    }
];

export const Profile:React.FC<{userProfile: boolean}> = ({userProfile}) => {
    const [switchTab, setSwitchTab] = useState<number>(0);

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

    useEffect(() => {setSwitchTab(0)},[userProfile]);

    return (
        <main id="profilePage">
            <div className="profil">
                <div className='container'>
                        <div className="col col-md-11 col-lg-9 col-xl-8">
                            <ProfileInfos userProfile={userProfile}/>
                        </div>
                        <div className="col col-md-11 col-lg-9 col-xl-8">
                            {userProfile && <nav className="profileTabs">
                                <ul className="tabs">
                                    {tabs.map((tab, index) => (
                                        <li key={`${tab.title.replace(' ', '_')}`} className={"tabTitle "+(switchTab === index ? "active" : "")} onClick={() =>  setSwitchTab(index)}>{tab.title}</li>
                                    ))}
                                </ul>
                            </nav>}
                            <div className="tabHeader">
                                <hr/>
                                <div className="title">
                                    {<div key={`${tabs[switchTab].title.replace(' ', '')}`}>
                                        <FontAwesomeIcon icon={tabs[switchTab].icon} />
                                        <span>{tabs[switchTab].title}</span>
                                    </div>}
                                </div>
                                <hr/>
                            </div>
                            {switchTab === 0 && <MatchesHistory />}
                            {switchTab === 1 && userProfile && <FriendsManager />}
                        </div>
                    </div>
            </div>
        </main>);
}