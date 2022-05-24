import React from 'react'
import { CircleAvatar } from '../circle_avatar/circle_avatar'

interface Props {
    username: string,
    image: string,
    last_msg: string,
    time_last_msg: string,
    nbr_msg_not_read: number,
}

export const Item_chatroom = (Props : Props) => {
  return (
    <div className="item">
      <div className='container item-container'>
        <div className="row item-row">
          <div className="col-xs-2 col-sm-2 col-md-3 col-lg-3 img">
            <CircleAvatar avatarURL={Props.image} dimensions={50}/>
          </div>

          <div className="col-xs-8 col-sm-8 col-md-6 col-lg-7 user_lastmsg">
            <span className="username">{Props.username}</span> 
            <span className="lastmsg">{Props.last_msg}</span>
          </div>
          <div className="col-xs-2 col-sm-2 col-md-3 col-lg-2 time_nbrmsg">
            <span className="time">{Props.time_last_msg}</span> 
            <span className="nbrmsg">{Props.nbr_msg_not_read}</span>
          </div>

        </div>
      </div>
      <div className="line">
      </div>
    </div>
  )
}
