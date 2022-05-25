import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";



interface Props {
    background?: string,
    cardTitle?: string,
    icon: string,
    image: string,
    cardSubtitle?: string,
    btnTitle: string,
}

library.add(faGamepad);

export const Card:React.FC<Props> = (Props) => {
    return (
        <div id="card" style={{backgroundImage: `url(${Props.background})`}}>
            <div className="overlay">
                <img src={Props.image} />
                <button>
                    <FontAwesomeIcon icon="gamepad"/>
                    {Props.btnTitle}
                </button>
            </div>
        </div>);
}