import { UserIcon } from "assets";
import React from "react";


interface Props {
    avatarURL: string,
    dimensions: number,
    borderWidth?: number,
    borderColor?: string,
    status?: string,
}

export const CircleAvatar:React.FC<Props> = (Props) => {
    return (<span id="circleAvatar" style={{backgroundImage: `url(${Props.avatarURL === null ? UserIcon : Props.avatarURL})`,
    minWidth: Props.dimensions,
    minHeight: Props.dimensions,
    maxWidth: Props.dimensions,
    maxHeight: Props.dimensions,
    borderWidth: Props.borderWidth,
    borderColor: Props.borderColor}}>{Props.status && <i className={`status ${Props.status.toLowerCase()}`}></i>}</span>);
}