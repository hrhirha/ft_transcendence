import React from 'react'
import { CircleAvatar } from '../../../components/circle_avatar/circle_avatar'

interface Props {
    username: string,
    image: string,
    last_msg: string,
    time_last_msg: string,
    nbr_msg_not_read: number,
    active: boolean
}

export const ChatRoomItem = (Props : Props) => {
  return (
    <div id='chatRoomItem' className={Props.active ? 'active' : undefined}>
      <CircleAvatar avatarURL={Props.image} dimensions={40}/>
      <div className='dataColumn'>
        <div className='dataRow'>
          <h6 className='userName'>{Props.username}</h6>
          <span className='time'>{Props.time_last_msg}</span>
        </div>
        <div className='dataRow'>
          <p className='lastMsg'>{Props.last_msg}</p>
          <span className='nbNotifs'>{Props.nbr_msg_not_read}</span>
        </div>
      </div>
    </div>
  )
}
