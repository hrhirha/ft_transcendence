import { faUsers, faUsersBetweenLines, faUsersRays, faUsersSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { EmptyBlocking, EmptyFriends, EmptyFriendsRequests, EmptyPending } from "../../../../assets";
import { frinds_data } from "../../../../test_data/frinds_data";
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
    const [friendsList, setFriendsList] = useState<Array<any>>([]);
    useEffect(() => {
        //fetch data from server
        // if (activeTab.valueOf() === tabs.friends.valueOf())
        //     return;
        frinds_data && frinds_data.forEach (({type, avatar, fullName,  username, ranking}, k ) => {
            if (type.valueOf() === activeTab.valueOf())
                setFriendsList(prev => [...prev, {type, avatar, fullName, username, ranking}]);
        })
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
                        {activeTab === tabs.friends && <img alt="empty" src={EmptyFriends}/>}
                        {activeTab === tabs.friends && <h5>You Have No Friends Yet</h5>}
                        {activeTab === tabs.requests && <img alt="empty" src={EmptyFriendsRequests}/>}
                        {activeTab === tabs.requests && <h5>You Have No Friend Requests</h5>}
                        {activeTab === tabs.blocking && <img alt="empty" src={EmptyBlocking}/>}
                        {activeTab === tabs.blocking && <h5>You Didn't Block Any One</h5>}
                        {activeTab === tabs.pending && <img alt="empty" src={EmptyPending}/>}
                        {activeTab === tabs.pending && <h5>You Have No Pending Requests</h5>}
                    </div>}
                    {friendsList.length > 0
                    && friendsList.map((friend, k) => 
                    <FriendCard
                        key={k}
                        type = {friend.type}
                        avatar = {friend.avatar}
                        fullName= {friend.fullName}
                        username = {friend.username}
                        ranking= {friend.ranking}
                    />)}
                </div>
            </div>
        </section>
    );
}
