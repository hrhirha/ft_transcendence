import React from "react";


interface Props {
    avatarURL: string,
    width: number,
    height: number,
    borderWidth: number,
    borderColor: string
}

export const Card:React.FC<Props> = (Props) => {
    return (<span id="circleAvatar" style={{backgroundImage: `url(${Props.avatarURL})`,
    width: Props.width,
    height: Props.height,
    borderWidth: Props.borderWidth,
    borderColor: Props.borderColor}}></span>);
}