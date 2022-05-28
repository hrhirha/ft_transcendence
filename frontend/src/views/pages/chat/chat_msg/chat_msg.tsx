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
    <div className={(!Props.display_image ? "mtop " : "") + (Props.sender_user === "111" ? "Me" : "User")}>
        {!Props.display_image && <CircleAvatar avatarURL={Props.image} dimensions={30}/>}
        <span className={Props.display_image? "first_msg" : "msg"}>{Props.msg}</span>
    </div>
  )
}
