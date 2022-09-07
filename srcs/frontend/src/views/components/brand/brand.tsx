import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPingPongPaddleBall } from "@fortawesome/free-solid-svg-icons";


export const Brand:React.FC = () => {
    return (
        <div id="brandLogo">
            <FontAwesomeIcon icon={faPingPongPaddleBall}/>
            <div>
                <span><b>Ping</b>Pong</span>
                <i>transcendence</i>
            </div>
        </div>
    );
}