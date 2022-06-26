import React, { useEffect, useState } from "react";
import { FriendsManager } from "./friends_manager/friends_manager";
import { ProfileInfos } from "./profile_infos/profile_infos";
import {faUserSlash, faUserCheck, faUserMinus, faUserXmark, faUserPlus, faComment, faUsersGear, faHistory} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MatchesHistory } from "./matches_history/matches_history";
import { AuthChecker } from "../../components/check_auth/auth_checker";
import { get_me } from "../../../controller/user/user";
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
        onClick: async (userId: string) => {
            try {
                await post_friendreq_send(userId);
            } catch(err) {

            } 
        }
    },
    {
        type: userType.request,
        icon: faUserCheck,
        text: 'Accept',
        onClick: async (userId: string) => {
            try {
                await post_friendreq_accept(userId);
            } catch(err) {

            } 
        }
    },
    {
        type: userType.request,
        icon: faUserXmark,
        text: 'Decline',
        onClick: async (userId: string) => {
            try {
                await post_friendreq_decline(userId);
            } catch(err) {

            }
        }
    },
    {
        type: userType.friend,
        icon: faUserMinus,
        text: 'Unfriend',
        onClick: async (userId: string) => {
            try {
                await post_friend_unfriend(userId);
            } catch(err) {

            }
        }
    },
    {
        type: userType.friend,
        icon: faUserSlash,
        text: 'Block',
        onClick: async (userId: string) => {
            try {
                await post_friend_block(userId);
            } catch(err) {

            }
        }
    },
    {
        type: userType.blocked,
        icon: faUserMinus,
        text: 'Unblock',
        onClick: async (userId: string) => {
            try {
                await post_friend_unblock(userId);
            } catch(err) {

            }
        }
    },
    {
        type: userType.pending,
        icon: faUserXmark,
        text: 'Cancle',
        onClick: async (userId: string) => {
            try {
                await post_friendreq_cancel(userId);
            } catch(err) {

            }
        }
    }
];

export const Profile:React.FC = () => {
    const [switchTab, setSwitchTab] = useState<number>(0);
    const [editable, setEditable] = useState<boolean>(false);
    const [userInfos, setUserInfos] = useState<any>(null);

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
    useEffect(() => {
        (async function() {
            try {
                const me = await get_me();
                setUserInfos(me);
            } catch (err) {
                //error
            }
        })();
    },[]);
    return (
    <AuthChecker
        redirect="/profile"
        wrappedContent={
        <main id="profilePage">
            <div className="profil">
                <div className='container'>
                        <div className="col col-md-11 col-lg-9 col-xl-8">
                            <ProfileInfos avatar={userInfos?.imageUrl} fullName={userInfos?.fullName} username={userInfos?.username}  ranking={userInfos?.rank || 0} wins={userInfos?.wins} loses={userInfos?.loses}/>
                        </div>
                        <div className="col col-md-11 col-lg-9 col-xl-8">
                            <nav className="profileTabs">
                                <ul className="tabs">
                                    {tabs.map((tab, index) => (
                                        <li key={`${tab.title.replace(' ', '_')}`} className={"tabTitle "+(switchTab === index ? "active" : "")} onClick={() =>  setSwitchTab(index)}>{tab.title}</li>
                                    ))}
                                </ul>
                            </nav>
                            <div className="tabHeader">
                                <hr/>
                                <div className="title">
                                    {tabs.map((tab, index) => {
                                        if (index === switchTab) {
                                            return <div key={`${tab.title.replace(' ', '')}`}>
                                                <FontAwesomeIcon icon={tab.icon} />
                                                <span>{tab.title}</span>
                                            </div>
                                        }
                                        return null;
                                    })}
                                </div>
                                <hr/>
                            </div>
                            {switchTab === 0 && <MatchesHistory />}
                            {switchTab === 1 && <FriendsManager />}
                        </div>
                    </div>
            </div>
        </main>}
    />);
}