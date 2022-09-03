import { faArrowRightFromBracket, faCheck, faClose, faGamepad, faKey, faLockOpen, faPenToSquare, faTrash, faTrashCan, faUser, faUsers, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GroupIcon } from "assets";
import { management_memeber, management_password, room_msgs, user_info } from "controller/chat_socket/interface";
import { getIDQuery, SocketContext } from "index";
import { useContext, useEffect, useState } from "react";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { MemeberCard } from "views/pages/chat/chat_room_settings/member_card/member_card";
import { useNavigate } from "react-router-dom";
import { useNotif } from "views/components/notif/notif";
import { Numeral } from "views/components/numeral/numeral";
import { UserSearchForm } from "views/components/user_search/user_search";
import { User } from "controller/user/user";
import { UserCheckedCard, validChannelTitel, validPassword } from "../create_chat/create_chat";


const EditChatRoomSettings:React.FC<{room: room_msgs, members: Array<user_info>, callback: Function}> = ({room, members, callback}) => {
    const [selectedUsers, setSelectedUsers] = useState<user_info[]>([]);
    const [exceptUsers, setExceptUsers] = useState<string[]>(members.map(u => u.id));
    const [passwordEditState, setPasswordEditState] = useState<number>(0);
    const [channelTitle, setChannelTitle] = useState<string>(room.name);
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const class_socket = useContext(SocketContext);
    const pushNotif = useNotif();

    useEffect(() => {
        setExceptUsers(members.map(u => u.id).concat(selectedUsers.map(u => u.id)));
    }, [selectedUsers]);


    useEffect(() => {
        class_socket.socket.on("password_edited",(data : management_password)=>{
            room.type = data.type;
            setPasswordEditState(0);
            setNewPassword("");
            setOldPassword("");
            pushNotif({
                id: "password_edited",
                type: "success",
                icon: <FontAwesomeIcon icon={faKey}/> ,
                title: "success",
                description: "Password updated successfully",
            });
        }).on("room_edited", (data : any)=>{
            console.log(data)
            callback(data);
        }).on("invalid_password", () => {
            pushNotif({
                id: "invalid_password",
                type: "error",
                icon: <FontAwesomeIcon icon={faKey}/> ,
                title: "error",
                description: "Invalid password",
            });
        });

    }, []);

    const savePassword = () => {
        if(passwordEditState === 1)
            class_socket.set_password({id : room.id, new_password : newPassword});
        if(passwordEditState === 3)
            class_socket.remove_password({id : room.id,  old_password : oldPassword});
        if(passwordEditState === 2)
            class_socket.change_password({id : room.id, new_password : newPassword, old_password : oldPassword});
    }

    return (
    <form id="manageMembers" onSubmit={(e) => {e.preventDefault(); 
        class_socket.edit_room({rid : room.id, name : channelTitle, uids: selectedUsers.map((u : user_info )=> u.id)});
    }} >
        <input type="text" className={`inputStyle ${validChannelTitel(channelTitle) ? "":"error"}`} value={channelTitle} onChange={(e) => {setChannelTitle(e.target.value)}} placeholder="Channel Title" />
        <div className="managePassword">
            {room.type === "PROTECTED" &&
                <>
                    {passwordEditState === 0 && <span className="passwordBtn" onClick={() => setPasswordEditState(2)}><FontAwesomeIcon icon={faKey}/> Edit Password</span>}
                    {passwordEditState === 0 && <span className="passwordBtn" onClick={() => setPasswordEditState(3)}><FontAwesomeIcon icon={faLockOpen}/>Remove Password</span>}
                    {passwordEditState === 2 && <>
                        <input type="password" placeholder="Old Password"  className={`inputStyle ${validPassword(oldPassword) ? "":"error"}`} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                        <input type="password" placeholder="New Password" className={`inputStyle ${validPassword(newPassword) ? "":"error"}`} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    </>}
                    {passwordEditState === 3 && <>
                        <input type="password" placeholder="Old Password"  className={`inputStyle ${validPassword(oldPassword) ? "":"error"}`} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                    </>}
                </>}
            {room.type === "PUBLIC" && <>
                {passwordEditState === 0 && <span  className="passwordBtn" onClick={() => setPasswordEditState(1)}><FontAwesomeIcon icon={faKey}/> Set Password</span>}
                {passwordEditState === 1 && <input type="password" placeholder="Password"  className={`inputStyle ${validPassword(newPassword) ? "":"error"}`} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>}
            </>}
            {passwordEditState === 1 && validPassword(newPassword) &&
            <button onClick={() => savePassword()} className="save">
                <FontAwesomeIcon icon={faCheck}/>
                Save password
            </button>}
            {passwordEditState === 2 && validPassword(newPassword) && validPassword(oldPassword) &&
            <button onClick={() => savePassword()} className="save">
                <FontAwesomeIcon icon={faPenToSquare}/>
                Update password
            </button>}
            {passwordEditState === 3 && validPassword(oldPassword) &&
            <button onClick={() => savePassword()} className="cancel">
                <FontAwesomeIcon icon={faClose}/>
                Remove password
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
        <div className="actions">
            <button type="button" onClick={() => {
                callback({members, ...room});
            }} className="cancel">
                <FontAwesomeIcon icon={faClose}/>
                Cancel
            </button>
            <button type="submit" className="save">
                <FontAwesomeIcon icon={faCheck}/>
                Save
            </button>
        </div>
    </form>);
}

export const ChatRoomSettings:React.FC<{room : room_msgs, onClose: Function}> = ({room, onClose}) => {

    const navigate = useNavigate();
    const class_socket = useContext(SocketContext);
    const [members, setMembers] = useState<user_info[]>([]);
    //const [users, setUsers] = useState<user_info[]>([]);
    const [owner, setOwner] = useState<boolean>(false);
    const [editable, setEditable] = useState<boolean>(false);
    const pushNotif = useNotif();
    const [permession, setPermession] = useState<number>(0);


    useEffect(() => {
        class_socket.get_members({id : getIDQuery()});
        class_socket.socket.on("members", (data : user_info[])=>{
            setMembers(data);

            setOwner(data.find((u) => u.is_owner === true && u.id === JSON.parse(window.localStorage.getItem("user")).id ) !== undefined)
            if(data.find((u) => u.is_owner === true && u.id === JSON.parse(window.localStorage.getItem("user")).id ) !== undefined)
                setPermession(2);
            else if(data.find((u) => u.is_admin === true && u.id === JSON.parse(window.localStorage.getItem("user")).id ) !== undefined)
                setPermession(1);
            else
                setPermession(0);
        })



        class_socket.socket.on("user_banned", (data : management_memeber)=>{
            if(getIDQuery() === data.rid && JSON.parse(window.localStorage.getItem("user")).id !== data.uid)
                class_socket.get_members({id : getIDQuery()});
        })
        
        class_socket.socket.on("user_unbanned", (data : management_memeber)=>{ 
            class_socket.get_members({id : getIDQuery()});
        })

        class_socket.socket.on("user_muted", (data : management_memeber)=>{
            class_socket.get_members({id : getIDQuery()});
        })
        class_socket.socket.on("user_unmuted", (data : management_memeber)=>{
            class_socket.get_members({id : getIDQuery()});
        })

        class_socket.socket.on("admin_added", (data : management_memeber)=>{ 
            class_socket.get_members({id : getIDQuery()});
        })

        class_socket.socket.on("admin_removed", (data : management_memeber)=>{ 
            class_socket.get_members({id : getIDQuery()});
        })

        class_socket.socket.on("user_removed", (data : management_memeber)=>{ 
            class_socket.get_members({id : getIDQuery()});
        })


    },[])

    const editChannel = () => {
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

    const settingsEdit = (data: any) =>{
        setMembers(data.members);
        setEditable(false);
    }

    return (
        <section id="chatRoomSettings">
            <div className="roomSettings">
                <span className="closeSettings" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
                <div className="chatInfos user">
                    <CircleAvatar avatarURL={GroupIcon} dimensions={100} status={null}/>
                    {!editable && <h5 className="channelTitle">{room.name}</h5>}
                </div>
                {!editable &&<><span className="addMem"><FontAwesomeIcon icon={faUsers} />Group Memebers ({<Numeral value={members.length}/>})</span>
                <div className="members">
                    {
                        members.map((member, k) => 
                            <MemeberCard 
                                key={k}
                                roomId={room.id}
                                id={member.id}
                                permession={permession}//bddl
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
                {editable && <EditChatRoomSettings room={room} members={members} callback={settingsEdit}/>}
                {!editable && <div className="channelOptions">
                    {owner && <span onClick={() => editChannel()}><FontAwesomeIcon icon={faPenToSquare}/>Edit Channel</span>}
                    {owner && <span className="delete" onClick={() => deleteChannel()}><FontAwesomeIcon icon={faTrash}/>Delete Channel</span>}
                    {!owner && <span className="leave" onClick={() => leaveChannel()}><FontAwesomeIcon icon={faArrowRightFromBracket}/>Leave Channel</span>}
                </div>}
            </div>
        </section>
    );
}