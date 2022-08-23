import { faGamepad, faPingPongPaddleBall, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { get_all_users, User } from "controller/user/user";
import React, { useState, useEffect } from "react";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { useNotif } from "views/components/notif/notif";

const SuggestionCard:React.FC<{avatar: string, fullName: string, username: string, status: string, onClick: Function}> = ({avatar, fullName, username, status, onClick}) => {
    return <div className="suggestionCard" onClick={() => onClick()}>
        <CircleAvatar dimensions={42} avatarURL={avatar} status={null}/>
        <div className="userInfos">
            <h6>{fullName}</h6>
            <span>@{username}</span>
        </div>
        <span className={`status ${status.toUpperCase()}`}>{status.toUpperCase()}</span>
    </div>;
}

export const InvitePlayerForm:React.FC<{callback: Function}> = ({callback}) => {
    const [allUsers, setAllUsers] = useState<Array<User>>([]);
    const [suggestions, setSuggestions] = useState<Array<any>>([]);
    const [userSelected, setUserSelected] = useState(null);
    const [userInput, setUserInput] = useState("");
    const pushNotif = useNotif();

    useEffect(() => {
        if (userSelected !== null) {
            callback(userSelected);
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

    const sentInvite = (user: User, ultimate: boolean) => {
        try {
            //sent invitation
            pushNotif({
                id: `INVITATIONSENTTO${user.id}`,
                type: "info",
                time: 15000,
                icon: <FontAwesomeIcon icon={faGamepad}/>,
                title: "Game Invitation",
                description: `You have invited <b>${user.fullName}</b> to play ${ultimate ? "an <b>ULTIMATE" : "a <b>NORMAL"} GAME</b>, please wait for his answer!`
            });
        } catch(e: any) {
            pushNotif({
                id: "GAMEINVITATIOERROR",
                type: "info",
                time: 15000,
                icon: <FontAwesomeIcon icon={faGamepad}/>,
                title: "Game Invitation",
                description: e.message
            });
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.trim().length > 10) {
            e.preventDefault();
            return;
        }
        setSuggestions([]);
        setTimeout(getUsers,10000);
        setUserInput(e.target.value.trim());
        if (e.target.value.trim().length > 0)
        {
            allUsers.forEach((user: any, key: number) => {
                if (user.username.toLowerCase().includes(e.target.value.trim().toLowerCase()))
                {
                    setSuggestions(prvSugges => [...prvSugges,<SuggestionCard onClick={() => {
                        setUserSelected(user);
                        setSuggestions([]);
                        setUserInput("");
                        pushNotif({
                            id: `GAMEINVITATION`,
                            type: "info",
                            time: 15000,
                            icon: <FontAwesomeIcon icon={faGamepad}/>,
                            title: "Game Invitation",
                            description: `Which game you want to play with <b>${user.fullName}</b> ?`,
                            actions: [
                                {title: "Normal Game", color: "#6970d4", action: async () => sentInvite(user, false)},
                                {title: "Ultimate Game", color: "#6970d4", action: async () => sentInvite(user, true)}
                            ] 
                        });
                    }} avatar={user.imageUrl} username={user.username} status={user.status} fullName={user.fullName} key={key} />]);
                }
            });
        }
    }

    return (
    <section id="invitePlayer">
        <div className="sectionTitle">
            <FontAwesomeIcon icon={faPingPongPaddleBall}/>
            <h2>Invite Player</h2>
        </div>
        <div className="searchFrom">
            <div className="searchInput">
                <FontAwesomeIcon icon={faSearch} />
                <input id="username" type="text" value={userInput} onChange={(e) => handleChange(e)} placeholder="username" autoComplete="off"/>
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