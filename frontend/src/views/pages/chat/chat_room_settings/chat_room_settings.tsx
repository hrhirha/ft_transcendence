import { faArrowRightFromBracket, faClose, faGamepad, faPenToSquare, faTrash, faUser, faUsers, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DefaultGame, UltimateGame } from "assets";
import { user_info } from "chat_socket/interface";
import { SocketContext } from "index";
import { useContext, useEffect, useState } from "react";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { MemeberCard } from "views/pages/chat/chat_room_settings/member_card/member_card";
import { SettingsOption } from "views/pages/chat/chat_room_settings/settings_option/settings_option";
import { useNavigate } from "react-router-dom";
import { useNotif } from "views/components/notif/notif";



export const ChatRoomSettings:React.FC<{fullName : string, roomId: string, onClose: Function}> = ({fullName, roomId, onClose}) => {

    const navigate = useNavigate();
    const class_socket = useContext(SocketContext);
    const [members, setMembers] = useState<user_info[]>([]);
    const [owner, setOwner] = useState<user_info>();
    const pushNotif = useNotif();

    //JSON.parse(window.localStorage.getItem("user")).id 

    useEffect(() => {
        class_socket.get_members({id : roomId});
        console.log(roomId);

        class_socket.socket.on("members", (data : user_info[])=>{
            setMembers(data);
            setOwner(data.find((u) => u.is_owner === true))
        })

    },[])

    return (
        <section id="chatRoomSettings">
            <div className="roomSettings">
                <span className="closeSettings" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
                <div className="chatInfos user" onClick={() => alert(`Go To Profile`)}>
                    <CircleAvatar avatarURL="" dimensions={100} status={null}/>
                    <input type="text" placeholder="Channel title" disabled className="channelTitle" value={fullName}/>
                    {/* <input type="password" placeholder="Channel password" className="channelTitle"/> */}
                    <p>
                        <FontAwesomeIcon icon={faUsers}/>
                        {members.length} members
                    </p>
                </div>
                <div className="channelOptions options">
                    <SettingsOption icon={faPenToSquare} title="Edit Channel" onClick={() => alert("EDIT CHANNEL")}/>
                    <SettingsOption icon={faTrash} title="Delete Channel" onClick={() => alert("DELETE CHANNEL")}/>
                    <SettingsOption icon={faArrowRightFromBracket} title="Leave Channel" onClick={() => {
                            pushNotif({
                                id: roomId,
                                type: "info",
                                icon: <FontAwesomeIcon icon={faArrowRightFromBracket}/> ,
                                title: "Leave Channel",
                                description: "Are you sure want to leave this channel",
                                actions: [
                                    {title: "Leave Channel", color: "#6970d4", action: () => {
                                        class_socket.leave_room({id : roomId})
                                        navigate(`/chat`, {replace: true})
                                    }},
                                ]
                            });

                        }
                    }/>
                </div>
                <h6><FontAwesomeIcon icon={faUsers} />Group Memebers</h6>
                <div className="members">
                    {
                        members.map((member, k) => 
                            <MemeberCard 
                                key={k}
                                
                                avatar={member.imageUrl} 
                                admin={member.is_admin} 
                                username={member.username} 
                                fullName={member.fullName} 
                                onClick={
                                    () => navigate(`/u/${member.username}`, {replace: true})}
                            />
                        )
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