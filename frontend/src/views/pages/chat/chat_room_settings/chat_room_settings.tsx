import { faArrowRightFromBracket, faClose, faGamepad, faPenToSquare, faTrash, faUser, faUsers, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DefaultGame, UltimateGame } from "../../../../assets";
import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";
import { MemeberCard } from "./member_card/member_card";
import { SettingsOption } from "./settings_option/settings_option";



export const ChatRoomSettings:React.FC<{roomId: string, onClose: Function}> = ({roomId, onClose}) => {
    return (
        <section id="chatRoomSettings">
            <div className="roomSettings">
                <span className="closeSettings" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
                <div className="chatInfos user" onClick={() => alert(`Go To Profile`)}>
                    <CircleAvatar avatarURL="https://i.pravatar.cc/100" dimensions={100} showStatus={false}/>
                    <input type="text" placeholder="Channel title" disabled className="channelTitle" value="Channel Title"/>
                    {/* <input type="password" placeholder="Channel password" className="channelTitle"/> */}
                    <p>
                        <FontAwesomeIcon icon={faUsers}/>
                        15 members
                    </p>
                </div>
                <div className="channelOptions options">
                    <SettingsOption icon={faPenToSquare} title="Edit Channel" onClick={() => alert("EDIT CHANNEL")}/>
                    <SettingsOption icon={faTrash} title="Delete Channel" onClick={() => alert("DELETE CHANNEL")}/>
                    <SettingsOption icon={faArrowRightFromBracket} title="Leave Channel" onClick={() => alert("LEAVE CHANNEL")}/>
                </div>
                <h6><FontAwesomeIcon icon={faUsers} />Group Memebers</h6>
                <div className="members">
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((member, k) => <MemeberCard key={k} avatar="https://i.pravatar.cc/100" admin={Math.round(Math.random()) == 1} username={`username${k}`} fullName={`Full Name ${k}`} onClick={() => alert(`Go To ${k} Profile`)}/>)
                    }
                </div>
                {/* <div className="DMOptions options">
                    <SettingsOption icon={faGamepad} title="Play Match"
                        subOptions={[
                            <div onClick={() => alert("Play Normal Game")} title="Play Normal Game" >
                                <CircleAvatar avatarURL={DefaultGame} dimensions={20} showStatus={false}/>
                                Normal Game
                            </div>,
                            <div onClick={() => alert("Play Ultimate Game")} title="Play Ultimate Game" >
                                <CircleAvatar avatarURL={UltimateGame} dimensions={20} showStatus={false}/>
                                Ultimate Game
                            </div>
                        ]}/>
                    <SettingsOption icon={faUser} title="Profile" onClick={() => alert("Go To User Profile")}/>
                    <SettingsOption icon={faUserSlash} title="Block" onClick={() => alert("Block User")}/>
                </div> */}
            </div>
        </section>
    );
}