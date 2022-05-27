import React from 'react'
import { CircleAvatar } from '../../../components/circle_avatar/circle_avatar'

interface Props {
    display_image :boolean,
    sender_user: string,
    image: string,
    msg: string,
    time: string,
}

export const Chat_msg = (Props : Props) => {
  return (
    <div className={Props.sender_user === "111" ? "Me" : "User"}>
        <div className={(Props.display_image === true) ? "display_image" : "image"}>
            <CircleAvatar avatarURL={Props.image} dimensions={14}/>
        </div>
        <span>{Props.msg}</span>
    </div>
  )
}
