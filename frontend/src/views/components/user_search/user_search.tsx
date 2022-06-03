import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPingPongPaddleBall } from "@fortawesome/free-solid-svg-icons";
import { CircleAvatar } from "../circle_avatar/circle_avatar";

const resulst = [
    {avatar: "https://i.pravatar.cc/301", username: "John Doe", status: "online"},
    {avatar: "https://i.pravatar.cc/302", username: "Ahmed Doe", status: "offline"},
    {avatar: "https://i.pravatar.cc/303", username: "Farid Doe", status: "ingame"},
    {avatar: "https://i.pravatar.cc/304", username: "Souliman Doe", status: "online"},
    {avatar: "https://i.pravatar.cc/305", username: "Nouaaman Doe", status: "online"},
    {avatar: "https://i.pravatar.cc/306", username: "Fatima Doe", status: "offline"},
    {avatar: "https://i.pravatar.cc/307", username: "Fedireco Doe", status: "online"},
    {avatar: "https://i.pravatar.cc/308", username: "Sarah Doe", status: "offline"},
    {avatar: "https://i.pravatar.cc/309", username: "Mouad Doe", status: "online"},
    {avatar: "https://i.pravatar.cc/310", username: "Walid Doe", status: "ingame"}
];

const SuggestionCard:React.FC<{avatar: string, fullName: string, onClick: Function}> = ({avatar, fullName, onClick}) => {
    return <div className="suggestionCard">
        <CircleAvatar dimensions={20} avatarURL={avatar} />
        <h6>{fullName}</h6>
    </div>;
}

export const UserSearchForm:React.FC<{callback: Function}> = ({callback}) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [checkedUsers, setCheckedUsers] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const handleChange = (input: string) => {
        console.log(input);
        setShowSuggestions(false);
        if (input.trim().length > 0) {
            setShowSuggestions(true);
            //get results from server
            setSuggestions([]);
            
            setSuggestions(resulst.filter((user: any, key: number) => {
                console.log(user.username.includes(input));
                    if (user.username.includes(input))
                    {
                        return <SuggestionCard onClick={() => {
                            setCheckedUsers([...checkedUsers, user]);
                            callback(checkedUsers);
                        }} avatar={user.avatar} fullName={user.username} key={key} />
                    }
                }));
                console.log(suggestions);
        }
    }
    return (
    <section id="searchUser">
        <input id="username" type="text" onChange={(e) => handleChange(e.target.value)} placeholder="username"/>
        {showSuggestions && <div className="suggestions">
            <ul id="suggestions">
                <li>{suggestions}</li>
            </ul>
        </div>}
    </section>
    );
}