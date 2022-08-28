import { faArrowRightFromBracket, faCheck, faClose, faGamepad, faPenToSquare, faTrash, faUser, faUsers, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GroupIcon } from "assets";
import { user_info } from "chat_socket/interface";
import { SocketContext } from "index";
import { useContext, useEffect, useState } from "react";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { MemeberCard } from "views/pages/chat/chat_room_settings/member_card/member_card";
import { SettingsOption } from "views/pages/chat/chat_room_settings/settings_option/settings_option";
import { useNavigate } from "react-router-dom";
import { useNotif } from "views/components/notif/notif";
import { Numeral } from "views/components/numeral/numeral";



export const ChatRoomSettings:React.FC<{fullName : string, roomId: string, onClose: Function}> = ({fullName, roomId, onClose}) => {

    const navigate = useNavigate();
    const class_socket = useContext(SocketContext);
    const [members, setMembers] = useState<user_info[]>([]);
    const [owner, setOwner] = useState<boolean>(false);
    const [editable, setEditable] = useState<boolean>(false);
    const pushNotif = useNotif();

    //JSON.parse(window.localStorage.getItem("user")).id 

    useEffect(() => {
        class_socket.get_members({id : roomId});
        console.log(roomId);

        class_socket.socket.on("members", (data : user_info[])=>{
            setMembers(data);
            setOwner(data.find((u) => u.is_owner === true && u.id === JSON.parse(window.localStorage.getItem("user")).id ) !== undefined)
        })

    },[])

    const editChannel = () => {
        console.log(editable)
        if (editable) {
            // class_socket.edit_channel({id : roomId, name : fullName});
            pushNotif({
                id: "EDIT_CHANNEL",
                type: "success",
                icon: <FontAwesomeIcon icon={faCheck}/> ,
                title: "Success",
                description: "Channel edited successfully"
            });
            setEditable(false);
        }
        else 
            setEditable(true);
    }

    const leaveChannel = () => {
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

    const deleteChannel = () => {
        pushNotif({
            id: roomId,
            type: "info",
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket}/> ,
            title: "Delete Channel",
            description: "Are you sure want to Delete this channel",
            actions: [
                {title: "Delete Channel", color: "#6970d4", action: () => {
                    class_socket.delete_room({id : roomId})
                }},
            ]
        });
    }

    return (
        <section id="chatRoomSettings">
            <div className="roomSettings">
                <span className="closeSettings" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
                <div className="chatInfos user">
                    <CircleAvatar avatarURL={GroupIcon} dimensions={100} status={null}/>
                    <input type="text" placeholder="Channel title" disabled={!editable} className="channelTitle" value={fullName}/>
                    {editable && <input type="password" placeholder="Channel password" className="channelTitle"/>}
                </div>
                <div className="channelOptions options">
                    {owner && <SettingsOption icon={faTrash} title="Delete Channel" onClick={() => deleteChannel()}/>}
                    {!owner &&<SettingsOption icon={faArrowRightFromBracket} title="Leave Channel" onClick={() => leaveChannel()}/>}
                    {owner && <SettingsOption icon={faPenToSquare} title="Edit Channel" onClick={() => editChannel()}/>}

                </div>
                <h6><FontAwesomeIcon icon={faUsers} />Group Memebers ({<Numeral value={members.length}/>})</h6>
                <div className="members">
                    {
                        members.map((member, k) => 
                            <MemeberCard 
                                key={k}
                                permession={1}
                                owner={member.is_owner} //Bddl
                                avatar={member.imageUrl} 
                                admin={member.is_admin} 
                                username={member.username} 
                                fullName={member.fullName} 
                                banned={member.is_banned} //Bddl
                                muted={member.is_muted} //Bddl
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