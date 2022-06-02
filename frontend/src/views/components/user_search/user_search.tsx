import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPingPongPaddleBall } from "@fortawesome/free-solid-svg-icons";
import { CircleAvatar } from "../circle_avatar/circle_avatar";



const SuggestionCard:React.FC<{avatar: string, fullName: string}> = ({avatar, fullName}) => {
    return <div className="suggestionCard">
        <CircleAvatar dimensions={20} avatarURL={avatar} />
        <h6>{fullName}</h6>
    </div>;
}

export const UserSearchForm:React.FC<{callback: Function}> = ({callback}) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const handleChange = (input: string) => {
        console.log(input);
        setShowSuggestions(false);
        if (input.trim().length > 0) {
            setShowSuggestions(true);
            //get results from server
            setSuggestions([]);
            for (let i = 0; i < 10; i++) {
                setSuggestions([...suggestions,
                    <li onClick={() => callback(i)} key={i}>
                        <SuggestionCard avatar="https://i.imgur.com/KiZ5h7p.png" fullName="John Smith" key={i} />
                    </li>]);
            }
        }
    }
    return (
    <section id="searchUser">
        <input id="username" type="text" onChange={(e) => handleChange(e.target.value)} placeholder="username"/>
        {showSuggestions && <ul id="suggestions">
            {suggestions}
        </ul>}
    </section>
    );
}