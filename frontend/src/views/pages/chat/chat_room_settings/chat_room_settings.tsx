import { faArrowRightFromBracket, faCheck, faClose, faGamepad, faKey, faLockOpen, faPenToSquare, faTrash, faTrashCan, faUser, faUsers, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GroupIcon } from "assets";
import { room_msgs, user_info } from "chat_socket/interface";
import { getIDQuery, SocketContext } from "index";
import { useContext, useEffect, useState } from "react";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { MemeberCard } from "views/pages/chat/chat_room_settings/member_card/member_card";
import { SettingsOption } from "views/pages/chat/chat_room_settings/settings_option/settings_option";
import { useNavigate } from "react-router-dom";
import { useNotif } from "views/components/notif/notif";
import { Numeral } from "views/components/numeral/numeral";
import { UserSearchForm } from "views/components/user_search/user_search";
import { User } from "controller/user/user";
import { UserCheckedCard } from "../create_chat/create_chat";


const EditChatRoomSettings:React.FC<{room: room_msgs, members: Array<user_info>, onSubmit: Function}> = ({room, members, onSubmit}) => {
    const [selectedUsers, setSelectedUsers] = useState<user_info[]>([]);
    const [exceptUsers, setExceptUsers] = useState<string[]>(members.map(u => u.id));
    const [passwordEditState, setPasswordEditState] = useState<number>(0);
    const [channelTitle, setChannelTitle] = useState<string>(room.name);
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");

    useEffect(() => {
        setExceptUsers(members.map(u => u.id).concat(selectedUsers.map(u => u.id)));
    }, [selectedUsers]);

    
    const removePassword = () => {
        //remove password
    }
    const setPassword = () => {
        //set password
    }
    const rupdatePassword = () => {
        //update password
    }

    return (
    <form id="manageMembers" onSubmit={(e) => {e.preventDefault();}}>
        <input type="text" className="inputStyle" value={channelTitle} onChange={(e) => {setChannelTitle(e.target.value)}} placeholder="Channel Title" />
        <div className="managePassword">
            {room.type === "PROTECTED" &&
                <>
                    {passwordEditState === 0 && <span className="passwordBtn" onClick={() => setPasswordEditState(2)}><FontAwesomeIcon icon={faKey}/> Edit Password</span>}
                    {passwordEditState === 0 && <span className="passwordBtn" onClick={() => removePassword()}><FontAwesomeIcon icon={faLockOpen}/>Remove Password</span>}
                    {passwordEditState === 2 && <>
                        <input type="password" placeholder="Old Password" className="inputStyle" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                        <input type="password" placeholder="New Password" className="inputStyle" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    </>}
                </>}
            {room.type === "PUBLIC" && <>
                {passwordEditState === 0 && <span  className="passwordBtn" onClick={() => setPasswordEditState(1)}><FontAwesomeIcon icon={faKey}/> Set Password</span>}
                {passwordEditState === 1 && <input type="password" placeholder="Password" className="inputStyle" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>}
            </>}
            {passwordEditState !== 0 && 
            <button onClick={() => setPassword()} className="save">
                <FontAwesomeIcon icon={faCheck}/>
                Save password
            </button>}
        </div>
        <span className="addMem"><FontAwesomeIcon icon={faUsers} />Add members</span>
        <UserSearchForm exceptUsers={exceptUsers} callback={(userSelected: User) => {
            setSelectedUsers([...selectedUsers, userSelected]);
        }}/>
        <div className="usersAdded">
            {selectedUsers.length > 0 && selectedUsers.map((user: User, k: number) => <UserCheckedCard
                key={k}
                onRemove={() => setSelectedUsers(prvResults => prvResults.filter((u: User) => u.id !== user.id))}
                avatar={user.imageUrl}
                fullName={user.fullName}
            />)}
        </div>
        <button type="submit" className="save">
            <FontAwesomeIcon icon={faCheck}/>
            Save
        </button>
    </form>);
}

export const ChatRoomSettings:React.FC<{room : room_msgs, onClose: Function}> = ({room, onClose}) => {

    const navigate = useNavigate();
    const class_socket = useContext(SocketContext);
    const [members, setMembers] = useState<user_info[]>([]);
    const [owner, setOwner] = useState<boolean>(false);
    const [editable, setEditable] = useState<boolean>(false);
    const pushNotif = useNotif();

    //JSON.parse(window.localStorage.getItem("user")).id 

    useEffect(() => {
        class_socket.get_members({id : getIDQuery()});
        console.log(getIDQuery());

        class_socket.socket.on("members", (data : user_info[])=>{
            setMembers(data);
            setOwner(data.find((u) => u.is_owner === true && u.id === JSON.parse(window.localStorage.getItem("user")).id ) !== undefined)
        })

    },[])

    const editChannel = () => {
        console.log(editable)
        if (editable) {
            // class_socket.edit_channel({id : getIDQuery(), name : fullName});
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
            id: getIDQuery(),
            type: "info",
            icon: <FontAwesomeIcon icon={faArrowRightFromBracket}/> ,
            title: "Leave Channel",
            description: "Are you sure want to leave this channel?",
            actions: [
                {title: "Leave Channel", color: "#6970d4", action: () => {
                    class_socket.leave_room({id : getIDQuery()})
                    navigate(`/chat`, {replace: true})
                }},
            ]
        });
    }

    const deleteChannel = () => {
        pushNotif({
            id: getIDQuery(),
            type: "error",
            icon: <FontAwesomeIcon icon={faTrashCan}/> ,
            title: "Delete Channel",
            description: "Are you sure want to Delete this channel?",
            actions: [
                {title: "Delete Channel", color: "#950c19", action: () => {
                    class_socket.delete_room({id : getIDQuery()})
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
                    {!editable && <h5 className="channelTitle">{room.name}</h5>}
                </div>
                {editable && <EditChatRoomSettings room={room} members={members} onSubmit={() => setEditable(false)}/>}
                {!editable && <div className="channelOptions options">
                    {owner && <SettingsOption icon={faTrash} title="Delete Channel" onClick={() => deleteChannel()}/>}
                    {!owner &&<SettingsOption icon={faArrowRightFromBracket} title="Leave Channel" onClick={() => leaveChannel()}/>}
                    {owner && <SettingsOption icon={faPenToSquare} title="Edit Channel" onClick={() => editChannel()}/>}
                </div>}
                {!editable &&<><span className="addMem"><FontAwesomeIcon icon={faUsers} />Group Memebers ({<Numeral value={members.length}/>})</span>
                <div className="members">
                    {
                        members.map((member, k) => 
                            <MemeberCard 
                                key={k}
                                permession={1}//bddl
                                owner={member.is_owner}
                                avatar={member.imageUrl} 
                                admin={member.is_admin} 
                                username={member.username} 
                                fullName={member.fullName} 
                                banned={member.is_banned}
                                muted={member.is_muted}
                                onClick={
                                    () => navigate(`/u/${member.username}`, {replace: true})}
                            />
                        )
                    }
                </div></>}
            </div>
        </section>
    );
}