import { CircleAvatar } from '../../../components/circle_avatar/circle_avatar'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

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
          <ReactTimeAgo className='time' date={Props.timeLastMsg} locale="en-US"/>
        </div>
        <div className='dataRow'>
          <p className='lastMsg'>{Props.lastMsg}</p>
          {Props.nbNotifs > 0 && <span className='nbNotifs'>{Props.nbNotifs}</span>}
        </div>
      </div>
    </div>
  )
}
