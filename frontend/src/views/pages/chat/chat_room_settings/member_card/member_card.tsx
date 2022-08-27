import { CircleAvatar } from 'views/components/circle_avatar/circle_avatar'
import { SettingsOption } from 'views/pages/chat/chat_room_settings/settings_option/settings_option';
import { faBan, faCommentSlash, faGamepad, faGear, faUserGear, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { DefaultGame, UltimateGame } from 'assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';


export const  MemeberCard:React.FC<{
        avatar: string,
        username: string,
        fullName: string,
        admin: boolean,
        owner: boolean,
        banned: boolean,
        muted: boolean,
        permession: number,
        onClick: Function}> = ({permession, avatar, username, fullName, admin, owner, banned, muted, onClick}) => {

        const [showMoreOptions, setShowMoreOptions] = useState(false);

  return (
      <div className="memberCard">
         <div className='userData' onClick={() => onClick()}>
            <CircleAvatar avatarURL={avatar} dimensions={45} status={null}/>
            <div className="dataRow">
                <span className="fullName">
                    {fullName}
                    {admin && <FontAwesomeIcon icon={faUserGear} title="Admin"/>}
                </span>
                <span className="userName">{username}</span>
            </div>
         </div>
          <div className="memberOptions">
            <SettingsOption icon={faGamepad} title="Play Match"
                subOptions={[
                    <div onClick={() => alert("Play Normal Game")} title="Normal Game" >
                        <CircleAvatar avatarURL={DefaultGame} dimensions={20} status={null}/>
                        Normal Game
                    </div>,
                    <div onClick={() => alert("Play Ultimate Game")} title="Ultimate Game" >
                        <CircleAvatar avatarURL={UltimateGame} dimensions={20} status={null}/>
                        Ultimate Game
                    </div>
                ]}/>
             <SettingsOption icon={faGear} title="Options"
                  subOptions={[
                    !banned && <div onClick={() => alert("Ban user")} title="Ban user" >
                        <FontAwesomeIcon icon={faBan}/>
                        Ban user
                    </div>,
                    banned && <div onClick={() => alert("Unban user")} title="Unban user" >
                        <FontAwesomeIcon icon={faBan}/>
                        Unban user
                    </div>,
                    !muted && <div className='hasOptions' title="Mute user" >
                        <div className='switch' onClick={() => setShowMoreOptions(opt => !opt)}>
                            <FontAwesomeIcon icon={faCommentSlash}/>
                            Mute user
                        </div>
                        {showMoreOptions && <ul className='moreOptions'>
                            <li onClick={() => alert("mute fo 15m")}>For 15 Minutes</li>
                            <li onClick={() => alert("mute fo 1h")}>For 1 Hour</li>
                            <li onClick={() => alert("mute fo 3h")}>For 3 Hours</li>
                            <li onClick={() => alert("mute fo 8h")}>For 8 Hours</li>
                            <li onClick={() => alert("mute fo 24h")}>For 24 Hours</li>
                            <li onClick={() => alert("mute fo inf")}>Until I turn it back on</li>
                        </ul>}
                    </div>,
                    muted && <div onClick={() => alert("Unmute user")} title="Unmute user" >
                        <FontAwesomeIcon icon={faCommentSlash}/>
                        Unmute user
                    </div>,
                    admin && !owner && <div onClick={() => alert("Remove admin")} title="Remove Admin" >
                        <FontAwesomeIcon icon={faUserGear}/>
                        Remove Admin
                    </div>,
                    !admin && <div onClick={() => alert("Set As Admin")} title="Set As Admin" >
                        <FontAwesomeIcon icon={faUserGear}/>
                        Set As Admin
                    </div>,
                    !owner && <div onClick={() => alert("Remove")} title="Remove user" >
                        <FontAwesomeIcon icon={faUserXmark}/>
                        Remove user
                    </div>
                  ]}/>
          </div>
      </div>
  );
}