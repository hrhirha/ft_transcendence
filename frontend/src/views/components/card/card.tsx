import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { DefaultGame } from '../../../assets';
import { CircleAvatar } from "../circle_avatar/circle_avatar";



interface Props {
    background?: string,
    cardTitle?: string,
    icon: string,
    cardSubtitle?: string,
    btnTitle: string,
}

library.add(faGamepad);

export const Card:React.FC<Props> = (Props) => {
    return (
        <div id="card" style={{backgroundImage: `url(${Props.background})`}}>
            <div className="overlay">
                <img src={DefaultGame} />
                <h6>{Props.cardTitle}</h6>
                <button>
                    <FontAwesomeIcon icon="gamepad"/>
                    {Props.btnTitle}
                </button>
            </div>
        </div>);
}