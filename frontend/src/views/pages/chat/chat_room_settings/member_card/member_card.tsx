import { CircleAvatar } from '../../../../components/circle_avatar/circle_avatar'
import { SettingsOption } from '../settings_option/settings_option';
import { faBan, faCommentSlash, faGamepad } from '@fortawesome/free-solid-svg-icons';
import { DefaultGame, UltimateGame } from '../../../../../assets';


export const  MemeberCard:React.FC<{avatar: string, username: string, fullName: string, onClick: Function}> = ({avatar, username, fullName, onClick}) => {
  return (
      <div className="memberCard" onClick={() => alert(`Go To ${username} Profile`)}>
          <CircleAvatar avatarURL={avatar} dimensions={45} showStatus={true}/>
          <div className="dataRow">
              <span className="fullName">{fullName}</span>
              <span className="userName">{username}</span>
          </div>
          <div className="memberOptions">
              <SettingsOption icon={faBan} title="Ban" onClick={() => console.log(`Ban ${username} from channel`)}/>
              <SettingsOption icon={faCommentSlash} title="Mute" onClick={() => console.log(`Mute ${username} from channel`)}/>
              <SettingsOption icon={faGamepad} title="Play Match"
                  subOptions={[
                      <div onClick={() => alert("Play Normal Game")} title="Normal Game" >
                          <CircleAvatar avatarURL={DefaultGame} dimensions={20} showStatus={false}/>
                          Normal Game
                      </div>,
                      <div onClick={() => alert("Play Ultimate Game")} title="Ultimate Game" >
                          <CircleAvatar avatarURL={UltimateGame} dimensions={20} showStatus={false}/>
                          Ultimate Game
                      </div>
                  ]}/>
          </div>
      </div>
  );
}