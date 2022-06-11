import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import React from "react";


interface Props {
    background?: string,
    image: string,
}

export const GameCard:React.FC<Props> = (Props) => {
    return (
        <div id="gameCard" style={{backgroundImage: `url(${Props.background})`}}>
            <div className="overlay">
                <img alt="game background" src={Props.image} />
                <button className="playGame">
                    <FontAwesomeIcon icon={faGamepad}/>
                    Play
                </button>
            </div>
        </div>);
}