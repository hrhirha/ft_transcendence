import { faGamepad, faPingPongPaddleBall, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get_all_users, User } from "controller/user/user";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { useNotif } from "views/components/notif/notif";

const SuggestionCard:React.FC<{avatar: string, fullName: string, username: string, status: string, onClick: Function}> = ({avatar, fullName, username, status, onClick}) => {
    return <div className="suggestionCard" onClick={() => onClick()}>
        <CircleAvatar dimensions={42} avatarURL={avatar} status={null}/>
        <div className="userInfos">
            <h6>{fullName}</h6>
            <span>@{username}</span>
        </div>
    </div>;
}

export const SearchUserForm:React.FC = () => {
    const [allUsers, setAllUsers] = useState<Array<User>>([]);
    const [suggestions, setSuggestions] = useState<Array<any>>([]);
    const [userSelected, setUserSelected] = useState(null);
    const [userInput, setUserInput] = useState("");
    const navigate = useNavigate();
    const pushNotif = useNotif();

    useEffect(() => {
        if (userSelected !== null) {
            navigate(`/u/${userSelected.username}`);
        }
    }, [userSelected]);

    useEffect(() => {
        getUsers();
    }, []);
    
    const getUsers = async () => {
        try {
            const allUsers = await get_all_users();
            setAllUsers(allUsers);
        } catch(e: any) {

        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.trim().length > 25) {
            e.preventDefault();
            return;
        }
        setSuggestions([]);
        setTimeout(getUsers,10000);
        setUserInput(e.target.value);
        if (e.target.value.trim().length > 0)
        {
            allUsers.forEach((user: any, key: number) => {
                if (user.username.toLowerCase().includes(e.target.value.trim().toLowerCase())
                || user.fullName.toLowerCase().includes(e.target.value.trim().toLowerCase()))
                {
                    setSuggestions(prvSugges => [...prvSugges,<SuggestionCard onClick={() => {
                        setUserSelected(user);
                        setSuggestions([]);
                        setUserInput("");
                    }} avatar={user.imageUrl} username={user.username} status={user.status} fullName={user.fullName} key={key} />]);
                }
            });
        }
    }

    return (
    <section id="searchForUser">
        <div className="searchFrom">
            <div className="searchInput">
                <FontAwesomeIcon icon={faSearch} />
                <input id="username" type="text" value={userInput} onChange={(e) => handleChange(e)} placeholder="Search for user" autoComplete="off"/>
            </div>
            <div className="suggestions">
                {suggestions.length === 0 && userInput.length > 0 && <span className="emptyResults">No user matched with "{userInput}"</span>}
                {suggestions.length > 0 && <ul id="suggestions">
                    {suggestions.map((s, k) => <li key={k}>{s}</li>)}
                </ul>}
            </div>
        </div>
    </section>
    );
}