import React from 'react'
import TimeAgo from 'timeago-react'
import { CircleAvatar } from '../../../components/circle_avatar/circle_avatar'

interface Props {
    avatar: string,
    fullName: string,
    lastMsg: string,
    timeLastMsg: Date,
    nbNotifs: number,
    active: boolean,
    onClick: Function,
}

export const ChatRoomItem = (Props : Props) => {
  return (
    <div id='chatRoomItem' onClick={() => Props.onClick()} className={Props.active ? 'active' : undefined}>
      <CircleAvatar avatarURL={Props.avatar} dimensions={40} showStatus={true}/>
      <div className='dataColumn'>
        <div className='dataRow'>
          <h6 className='userName'>{Props.fullName}</h6>
          <TimeAgo
            className='time'
            datetime={Props.timeLastMsg}
            live={false}
            locale='en'
          />
        </div>
        <div className='dataRow'>
          <p className='lastMsg'>{Props.lastMsg}</p>
          {Props.nbNotifs > 0 && <span className='nbNotifs'>{Props.nbNotifs}</span>}
        </div>
      </div>
    </div>
  )
}
