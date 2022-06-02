import React from "react";


interface Props {
    avatarURL: string,
    dimensions: number,
    borderWidth?: number,
    borderColor?: string
}

export const CircleAvatar:React.FC<Props> = (Props) => {
    return (<span id="circleAvatar" style={{backgroundImage: `url(${Props.avatarURL})`,
    minWidth: Props.dimensions,
    minHeight: Props.dimensions,
    maxWidth: Props.dimensions,
    maxHeight: Props.dimensions,
    borderWidth: Props.borderWidth,
    borderColor: Props.borderColor}}></span>);
}