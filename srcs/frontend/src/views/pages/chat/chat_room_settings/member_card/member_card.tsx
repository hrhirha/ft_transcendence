import { CircleAvatar } from 'views/components/circle_avatar/circle_avatar'
import { SettingsOption } from 'views/pages/chat/chat_room_settings/settings_option/settings_option';
import { faBan, faCommentSlash, faGamepad, faGear, faUserGear, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { DefaultGame, UltimateGame } from 'assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from 'index';
import { management_memeber } from 'controller/chat_socket/interface';
import { useNotif } from 'views/components/notif/notif';

export const  MemeberCard:React.FC<{
        id: string,
        roomId: string,
        avatar: string,
        username: string,
        fullName: string,
        admin: boolean,
        owner: boolean,
        banned: boolean,
        muted: boolean,
        permession: number,
        onClick: Function}> = ({permession, id, roomId, avatar, username, fullName, admin, owner, banned, muted, onClick}) => {

        const [showMoreOptions, setShowMoreOptions] = useState(false);
        const pushNotif = useNotif();
        const class_socket = useContext(SocketContext);

        const banUser = ()=> {
            class_socket.ban_user({uid : id,  rid : roomId});
        }

        const unbanUser = ()=> {
            class_socket.unban_user({uid : id,  rid : roomId});
        }

        const muteUser = (mutePeriod : string)=> {
            class_socket.mute_user({uid : id,  rid : roomId, mute_period: mutePeriod});
        }

        const unmuteUser = ()=> {
            class_socket.unmute_user({uid : id,  rid : roomId});
        }

        const setAdmin = ()=> {
            class_socket.add_admin({uid : id,  rid : roomId});
        } 
        const unsetAdmin = ()=> {
            class_socket.remove_admin({uid : id,  rid : roomId});
        }

        const removeMember = ()=> {
            class_socket.remove_member({uid : id,  rid : roomId});
        } 
        const challenge = (ultimate: boolean) => {
            try {
                class_socket.challenge({
                    id: id,
                    type: ultimate ? "ultimateQue" : "normaleQue",
                    invite: true
                });
                pushNotif({
                    id: `INVITATIONSENTTO${id}`,
                    type: "info",
                    time: 10000,
                    icon: <FontAwesomeIcon icon={faGamepad}/>,
                    title: "Game Invitation",
                    description: `You have invited <b>${fullName}</b> to play ${ultimate ? "an <b>ULTIMATE" : "a <b>NORMAL"} GAME</b>, please wait for his answer!`
                });
            } catch(e: any) {
                pushNotif({
                    id: "GAMEINVITATIOERROR",
                    type: "info",
                    time: 8000,
                    icon: <FontAwesomeIcon icon={faGamepad}/>,
                    title: "Game Invitation",
                    description: e.message
                });
            }
        }
  return (
      <div className="memberCard">
         <div className='userData' onClick={() => onClick()}>
            <CircleAvatar avatarURL={avatar} dimensions={45} status={null}/>
            <div className="dataRow">
                <span className="fullName">{fullName}</span>
                <span className="userName">
                    {username}
                    {admin && <FontAwesomeIcon icon={faUserGear} title="Admin"/>}
                </span>
            </div>
         </div>
          <div className="memberOptions">
            {(JSON.parse(window.localStorage.getItem("user")).id !== id) && <SettingsOption icon={faGamepad} title="Play Match"
                subOptions={[
                    <div onClick={() => challenge(false)} title="Normal Game" >
                        <CircleAvatar avatarURL={DefaultGame} dimensions={20} status={null}/>
                        Normal Game
                    </div>,
                    <div onClick={() => challenge(true)} title="Ultimate Game" >
                        <CircleAvatar avatarURL={UltimateGame} dimensions={20} status={null}/>
                        Ultimate Game
                    </div>
                ]}/>}
             {((permession === 1 || permession === 2) && JSON.parse(window.localStorage.getItem("user")).id !== id) && !owner && <SettingsOption icon={faGear} title="Options"
                  subOptions={[
                    !banned && <div onClick={() => banUser()} title="Ban user" >
                        <FontAwesomeIcon icon={faBan}/>
                        Ban user
                    </div>,
                    banned && <div onClick={() => unbanUser()} title="Unban user" >
                        <FontAwesomeIcon icon={faBan}/>
                        Unban user
                    </div>,
                    !banned && !muted && <div className='hasOptions' title="Mute user" >
                        <div className='switch' onClick={() => setShowMoreOptions(opt => !opt)}>
                            <FontAwesomeIcon icon={faCommentSlash}/>
                            Mute user
                        </div>
                        {showMoreOptions && <ul className='moreOptions'>
                            <li onClick={() => muteUser("15M")}>For 15 Minutes</li>
                            <li onClick={() => muteUser("1H")}>For 1 Hour</li>
                            <li onClick={() => muteUser("3H")}>For 3 Hours</li>
                            <li onClick={() => muteUser("8H")}>For 8 Hours</li>
                            <li onClick={() => muteUser("24H")}>For 24 Hours</li>
                            <li onClick={() => muteUser("inf")}>Until I turn it back on</li>
                        </ul>}
                    </div>,
                    !banned && muted && <div onClick={() => unmuteUser()} title="Unmute user" >
                        <FontAwesomeIcon icon={faCommentSlash}/>
                        Unmute user
                    </div>,
                    !banned && permession === 2 && admin && !owner && <div onClick={() => unsetAdmin()} title="Remove Admin" >
                        <FontAwesomeIcon icon={faUserGear}/>
                        Remove Admin
                    </div>,
                    !banned && permession === 2 && !admin && <div onClick={() => setAdmin()} title="Set As Admin" >
                        <FontAwesomeIcon icon={faUserGear}/>
                        Set As Admin
                    </div>,
                    permession > 0 && !owner && <div onClick={() => removeMember()} title="Remove user" >
                        <FontAwesomeIcon icon={faUserXmark}/>
                        Remove user
                    </div>
                  ]}/>}
          </div>
      </div>
  );
}