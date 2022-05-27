import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroadcastTower } from "@fortawesome/free-solid-svg-icons";
import React from "react";


interface Props {
    background?: string,
    title: string,
}

export const LiveGamesCard:React.FC<Props> = (Props) => {
    return (
        <div id="liveGamesCard" style={{backgroundImage: `url(${Props.background})`}}>
            <div className="overlay">
                <h6>{Props.title}</h6>
                <button id="watchLives">
                    <FontAwesomeIcon icon={faBroadcastTower}/>
                    Watch
                </button>
            </div>
        </div>);
}