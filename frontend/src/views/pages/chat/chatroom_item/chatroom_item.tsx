import { CircleAvatar } from 'views/components/circle_avatar/circle_avatar'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago';
import { GroupIcon } from 'assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

interface Props {
    avatar: string,
    fullName: string,
    lastMsg: string,
    timeLastMsg: Date,
    nbNotifs: number,
    isChannel: boolean,
    joined: boolean,
    active: boolean,
    onClick: Function,
    status?: string,
    type?: string,
}

export const ChatRoomItem = (Props : Props) => {
  return (
    <div id='chatRoomItem' onClick={() => Props.onClick()} className={Props.active ? 'active' : undefined}>
      <CircleAvatar avatarURL={!Props.isChannel ? Props.avatar : GroupIcon} dimensions={40} status ={Props.status}/>
      <div className='dataColumn'>
        <div className='dataRow'>
          <h6 className='userName'>{Props.fullName}</h6>
          {Props.joined && <ReactTimeAgo className='time' date={new Date(Props.timeLastMsg)} locale="en-US"/>}
          {!Props.joined && Props.type === "PROTECTED" && <FontAwesomeIcon icon={faLock}/>}
        </div>
        <div className='dataRow'>
          <p className='lastMsg'>{Props.lastMsg}</p>
          {!Props.active && Props.joined && Props.nbNotifs > 0 && <span className='nbNotifs'>{Props.nbNotifs}</span>}
        </div>
      </div>
    </div>
  )
}
