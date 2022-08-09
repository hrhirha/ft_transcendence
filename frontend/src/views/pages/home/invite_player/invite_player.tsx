import { faGamepad, faPingPongPaddleBall, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "controller/user/user";
import React, { useState, useEffect } from "react";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { useNotif } from "views/components/notif/notif";

const resulst = [
    {id: "5ads4f54adsf", avatar: "https://i.pravatar.cc/301", username: "jhondoe", fullName: "John Doe", status: "online"},
    {id: "5ads4fs4adsf", avatar: "https://i.pravatar.cc/302", username: "ahmedoe", fullName: "Ahmed Doe", status: "offline"},
    {id: "5addagfsadsf", avatar: "https://i.pravatar.cc/303", username: "faridoe", fullName: "Farid Doe", status: "ingame"},
    {id: "5adsdaa4adsf", avatar: "https://i.pravatar.cc/304", username: "soulima", fullName: "Souliman Doe", status: "online"},
    {id: "5adsghfgadsf", avatar: "https://i.pravatar.cc/305", username: "nouaama", fullName: "Nouaaman Doe", status: "online"},
    {id: "5ads4f54adsf", avatar: "https://i.pravatar.cc/306", username: "fatimad", fullName: "Fatima Doe", status: "offline"},
    {id: "5ads4f5sxcvf", avatar: "https://i.pravatar.cc/307", username: "fedirec", fullName: "Fedireco Doe", status: "online"},
    {id: "5adshjgjersf", avatar: "https://i.pravatar.cc/308", username: "sarahdo", fullName: "Sarah Doe", status: "offline"},
    {id: "5ads4fdfgdsf", avatar: "https://i.pravatar.cc/309", username: "mouaddo", fullName: "Mouad Doe", status: "online"},
    {id: "5ads4wrttgsf", avatar: "https://i.pravatar.cc/310", username: "waliddo", fullName: "Walid Doe", status: "ingame"}
];

const SuggestionCard:React.FC<{avatar: string, fullName: string, username: string, status: string, onClick: Function}> = ({avatar, fullName, username, status, onClick}) => {
    return <div className="suggestionCard" onClick={() => onClick()}>
        <CircleAvatar dimensions={30} avatarURL={avatar} showStatus={false}/>
        <div className="userInfos">
            <h6>{fullName}</h6>
            <span>@{username}</span>
        </div>
        <span className={`status ${status.toUpperCase()}`}>{status.toUpperCase()}</span>
    </div>;
}

export const InvitePlayerForm:React.FC<{callback: Function}> = ({callback}) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [userSelected, setUserSelected] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const pushNotif = useNotif();

    useEffect(() => {
        if (userSelected !== null) {
            callback(userSelected);
        }
    }, [userSelected]);
    
    const sentInvite = (user: User, ultimate: boolean) => {
        try {
            //sent invitation
            pushNotif({
                id: `INVITATIONSENTTO${user.id}`,
                type: "info",
                time: 15000,
                icon: <FontAwesomeIcon icon={faGamepad}/>,
                title: "Game Invitation",
                description: `You are invited ${user.fullName.toUpperCase()} to play ${ultimate ? "an ULTIMATE" : "a NORMAL"} GAME, please wait for his answer!`
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
        setShowSuggestions(false);
        if (e.target.value.trim().length > 0) {
            setShowSuggestions(true);
            setSuggestions([]);
            //get results from server
            resulst.forEach((user: any, key: number) => {
                if (user.username.toLowerCase().includes(e.target.value.toLowerCase()))
                {
                    setSuggestions(prvSugges => [...prvSugges,<SuggestionCard onClick={() => {
                        setShowSuggestions(false);
                        setUserSelected(user);
                        e.target.value = "";
                        pushNotif({
                            id: `GAMEINVITATION`,
                            type: "info",
                            time: 15000,
                            icon: <FontAwesomeIcon icon={faGamepad}/>,
                            title: "Game Invitation",
                            description: `Which game you want to play with ${user.fullName} ?`,
                            actions: [
                                {title: "Normal Game", color: "#6970d4", action: async () => sentInvite(user, false)},
                                {title: "Ultimate Game", color: "#6970d4", action: async () => sentInvite(user, true)}
                            ] 
                        });
                    }} avatar={user.avatar} username={user.username} status={user.status} fullName={user.fullName} key={key} />]);
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
                <input id="username" type="text" onChange={(e) => handleChange(e)} placeholder="username" autoComplete="off"/>
            </div>
            {showSuggestions && <div className="suggestions">
            <ul id="suggestions">
                {suggestions.map((s, k) => <li key={k}>{s}</li>)}
            </ul>
        </div>}
        </div>
    </section>
    );
}