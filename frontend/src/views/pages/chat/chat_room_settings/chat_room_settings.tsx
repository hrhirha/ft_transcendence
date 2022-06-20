import { faArrowRightFromBracket, faBan, faClose, faCommentSlash, faGamepad, faPenToSquare, faTrash, faUser, faUsers, faUserSlash, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { DefaultGame, UltimateGame } from "../../../../assets";
import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";



const Option:React.FC<{icon: IconDefinition, title: string, subOptions?: Array<any>, onClick?: Function}> = ({icon, title, subOptions, onClick}) => {
    const [showSubOptions, setShowSubOptions] = useState(false);
    return (
    <button
        className="option"
        title={title}
        onClick={() =>
        {
            if (!subOptions && onClick)
                onClick();
            else if (subOptions)
                setShowSubOptions(!showSubOptions);
        }}>
        <FontAwesomeIcon icon={showSubOptions ? faClose : icon}/>
        {showSubOptions && subOptions && <ul className="subOptions">
            {subOptions.map((option, k) => <li className="subOptionItem" key={k}>{option}</li>)}
        </ul>}
    </button>);
}

const MemeberCard:React.FC<{avatar: string, username: string, fullName: string, onClick: Function}> = ({avatar, username, fullName, onClick}) => {
    return (
        <div className="memberCard" onClick={() => alert(`Go To ${username} Profile`)}>
            <CircleAvatar avatarURL={avatar} dimensions={45} showStatus={true}/>
            <div className="dataRow">
                <span className="fullName">{fullName}</span>
                <span className="userName">{username}</span>
            </div>
            <div className="memberOptions">
                <Option icon={faBan} title="Ban" onClick={() => console.log(`Ban ${username} from channel`)}/>
                <Option icon={faCommentSlash} title="Mute" onClick={() => console.log(`Mute ${username} from channel`)}/>
                <Option icon={faGamepad} title="Play Match"
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
                    <Option icon={faPenToSquare} title="Edit Channel" onClick={() => alert("EDIT CHANNEL")}/>
                    <Option icon={faTrash} title="Delete Channel" onClick={() => alert("DELETE CHANNEL")}/>
                    <Option icon={faArrowRightFromBracket} title="Leave Channel" onClick={() => alert("LEAVE CHANNEL")}/>
                </div>
                {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((member, k) => <MemeberCard key={k} avatar="https://i.pravatar.cc/100" username={`username${k}`} fullName={`Full Name ${k}`} onClick={() => alert(`Go To ${k} Profile`)}/>)
                }
                {/* <div className="DMOptions options">
                    <Option icon={faGamepad} title="Play Match"
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
                    <Option icon={faUser} title="Profile" onClick={() => alert("Go To User Profile")}/>
                    <Option icon={faUserSlash} title="Block" onClick={() => alert("Block User")}/>
                </div> */}
            </div>
        </section>
    );
}