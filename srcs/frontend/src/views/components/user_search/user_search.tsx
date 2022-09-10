import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get_friends } from "controller/user/friends";
import { User } from "controller/user/user";
import React, { useState, useEffect } from "react";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";


const SuggestionCard:React.FC<{avatar: string, fullName: string, onClick: Function}> = ({avatar, fullName, onClick}) => {
    return <div className="suggestionCard" onClick={() => onClick()}>
        <CircleAvatar dimensions={20} avatarURL={avatar} status = {null}/>
        <h6>{fullName}</h6>
    </div>;
}

export const UserSearchForm:React.FC<{callback: Function, exceptUsers?: Array<String>}> = ({callback, exceptUsers}) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [userSelected, setUserSelected] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [friends, setFriends] = useState<User[]>();

    useEffect(() => {
        if (userSelected !== null) {
            callback(userSelected);
        }
    }, [userSelected]);

    useEffect(() => {
        (async () => {
            try {
                const users: User[] = await get_friends();
                setFriends(users);
            }
            catch (error) {

            }
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowSuggestions(false);
        if (e.target.value.trim().length > 0) {
            setShowSuggestions(true);
            setSuggestions([]);
            setUserSelected(null);
            friends.forEach((user: any, key: number) => {
                if (exceptUsers && exceptUsers.find(uid => uid === user.id) !== undefined)
                    return;
                if (user.username.toLowerCase().includes(e.target.value.toLowerCase()))
                {
                    setSuggestions(prvSugges => [...prvSugges,<SuggestionCard onClick={() => {
                        setShowSuggestions(false);
                        setUserSelected(user);
                        e.target.value = "";
                    }} avatar={user.imageUrl} fullName={user.fullName} key={key} />]);
                }
            });
        }
    }
    return (
    <section id="searchUser">
        <div className="searchInput">
            <FontAwesomeIcon icon={faSearch} />
            <input id="username" type="text" onChange={(e) => handleChange(e)} placeholder="username" autoComplete="off"/>
        </div>
        {showSuggestions && <div className="suggestions">
            <ul id="suggestions">
                {suggestions.map((s, k) => <li key={k}>{s}</li>)}
            </ul>
        </div>}
    </section>
    );
}