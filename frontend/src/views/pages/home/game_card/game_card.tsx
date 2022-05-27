import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";



interface Props {
    background?: string,
    image: string,
}

export const GameCard:React.FC<Props> = (Props) => {
    return (
        <div id="gameCard" style={{backgroundImage: `url(${Props.background})`}}>
            <div className="overlay">
                <img src={Props.image} />
                <button className="playGame">
                    <FontAwesomeIcon icon={faGamepad}/>
                    Play
                </button>
            </div>
        </div>);
}