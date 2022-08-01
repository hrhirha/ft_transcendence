import { faUsers, faUsersBetweenLines, faUsersRays, faUsersSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { EmptyBlocking, EmptyFriends, EmptyFriendsRequests, EmptyPending } from "../../../../assets";
import { get_friendreqs_received, get_friendreqs_sent } from "../../../../controller/user/friendreq";
import { get_friends, get_friends_blocked, user_info } from "../../../../controller/user/friends";
import { FriendCard } from "../friend_card/friend_card";



enum tabs {
    friends = 1,
    requests = 2,
    blocking = 3,
    pending = 4
}

const NavBar:React.FC<{activeTab: tabs, onChange: Function}> = ({activeTab, onChange}) => {
    return (
        <ul className="navTabs">
            <li className={activeTab === tabs.friends ? "active" : undefined}
                onClick={() => onChange(tabs.friends)}>
                <FontAwesomeIcon icon={faUsers}/>
                Friends
            </li>
            <li className={activeTab === tabs.requests ? "active" : undefined}
                onClick={() => onChange(tabs.requests)}>
                <FontAwesomeIcon icon={faUsersRays}/>
                Requests
            </li>
            <li className={activeTab === tabs.blocking ? "active" : undefined}
                onClick={() => onChange(tabs.blocking)}>
                <FontAwesomeIcon icon={faUsersSlash}/>
                Blocking
            </li>
            <li className={activeTab === tabs.pending ? "active" : undefined}
                onClick={() => onChange(tabs.pending)}>
                <FontAwesomeIcon icon={faUsersBetweenLines}/>
                Pending
            </li>
        </ul>
    );
}

export const FriendsManager:React.FC = () => {
    const [activeTab, setActiveTab] = useState<tabs>(tabs.friends);
    const [friendsList, setFriendsList] = useState<Array<user_info>>([]);
    useEffect(() => {
        (async () => {
            try {
                switch(activeTab)
                {
                    case tabs.pending:
                        const pending: user_info[] = await get_friendreqs_sent();
                        setFriendsList(pending);
                    break;
                    case tabs.blocking:
                        const blocked: user_info[] = await get_friends_blocked();
                        setFriendsList(blocked);
                    break;
                    case tabs.requests:
                        const reqFriends: user_info[] = await get_friendreqs_received();
                        setFriendsList(reqFriends);
                    break;
                    default:
                        const friends: user_info[] = await get_friends();
                        setFriendsList(friends);
                }
            } catch(err) {

            }
        })();
        return () => {
            setFriendsList([]);
        }
    }, [activeTab]);
    return (
        <section id="friendsManager">
            <nav className="headerNav">
                <NavBar activeTab={activeTab} onChange={(active: tabs) => {
                    setActiveTab(active);
                }}/>
            </nav>
            <div className="body">
                <div className="grid">
                    {friendsList.length === 0 && <div className="empty">
                        {activeTab === tabs.friends && <><img alt="empty" src={EmptyFriends}/><h5>You Have No Friends Yet</h5></>}
                        {activeTab === tabs.requests && <><img alt="empty" src={EmptyFriendsRequests}/><h5>You Have No Friend Requests</h5></>}
                        {activeTab === tabs.blocking && <><img alt="empty" src={EmptyBlocking}/><h5>You Didn't Block Any One</h5></>}
                        {activeTab === tabs.pending && <><img alt="empty" src={EmptyPending}/><h5>You Have No Pending Requests</h5></>}
                    </div>}
                    {friendsList.length > 0
                    && friendsList.map((friend: user_info) => 
                    <FriendCard
                        key={`${friend.id}`}
                        id={friend.id}
                        type = {activeTab.valueOf()}
                        avatar = {friend.imageUrl}
                        fullName= {friend.fullName}
                        username = {friend.username}
                        action={(id: string) => {setFriendsList(friendsList.filter((u) => u.id !== id))}}
                    />)}
                </div>
            </div>
        </section>
    );
}
