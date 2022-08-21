import { ChatRoom } from "views/pages/chat/chat_room/chat_room";
import  {ChatRoomItem }  from "views/pages/chat/chatroom_item/chatroom_item";
import {faCommentMedical, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreateNewChat } from "views/pages/chat/create_chat/create_chat";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatHomeVector, NoConversations } from "assets";
import { management_memeber, chats, dm_started, management_password, receive_message, room_created, user_joined, user_left, user_unbanned, user_muted, message_deleted, user_info, messages, dms, info_room, others } from "socket/interface";
import { SocketContext } from "index";


enum chatTabs {
    chats,
    joinedGroups,
    otherGroups
}

const ChatHome:React.FC<{onClick: Function}> = ({onClick}) => {
    return (
    <div id="chatHome">
        <img src={ChatHomeVector} alt="empty chat"/>
        <button onClick={() => onClick()}><FontAwesomeIcon icon={faCommentMedical} />New chat</button>
    </div>);
}

const ListChats:React.FC<{tab: chatTabs, activeChat: string | null, onSelectItem: Function, rooms:chats}> = ({tab, activeChat, onSelectItem, rooms}) => {
    const navigate = useNavigate();

    if ((tab === chatTabs.chats && ((rooms && rooms.dms.length === 0) || rooms === undefined)) 
        || (tab === chatTabs.joinedGroups && ((rooms && rooms.rooms.length === 0) || rooms === undefined))
        || (tab === chatTabs.otherGroups && ((rooms && rooms.others.length === 0) || rooms === undefined)))
    {
        return (
            <div className="noConversations">
                <img src={NoConversations} alt="empty chat"/>
                <span>No Conversations Here</span>
            </div>
        );
    }

    if (tab === chatTabs.joinedGroups)
    {
        return (<>{rooms.rooms.map((room : info_room, index: any) => 
            <ChatRoomItem
                key={index}
                isChannel={true}
                joined={true}
                avatar={null}
                fullName={room.name}
                lastMsg={room.lst_msg}
                nbNotifs={room.unread}
                timeLastMsg={room.lst_msg_ts}
                active={true}
                onClick={() => {
                    onSelectItem();
                    navigate({
                        pathname: '/chat',
                        search: `?id=${room.id}`,
                    }, {replace: true});
                }}
            />)}</>);
    }
    else if (tab === chatTabs.otherGroups)
    {
        return (<>{rooms.others.map((other : others, index: any) => 
            <ChatRoomItem
                key={index}
                isChannel={true}
                joined={false}
                avatar={null}
                fullName={other.name}
                lastMsg={null}
                nbNotifs={null}
                timeLastMsg={null}
                active={true}
                onClick={() => {
                    onSelectItem();
                    navigate({
                        pathname: '/chat',
                        search: `?id=${other.id}`,
                    }, {replace: true});
                }}
            />)}</>);
    }
    return (<>{rooms.dms.map((dms : dms, index: any) => 
            <ChatRoomItem
                key={index}
                isChannel={false}
                joined={true}
                avatar={dms.user.imageUrl}
                fullName={dms.user.fullName}
                lastMsg={dms.room.lst_msg}
                nbNotifs={dms.room.unread}
                timeLastMsg={(!dms.room.lst_msg_ts) ? new Date() : dms.room.lst_msg_ts}
                active={dms.room.id === activeChat}
                onClick={() => {
                    onSelectItem();
                    navigate({
                        pathname: '/chat',
                        search: `?id=${dms.room.id}`,
                    }, {replace: true});
                }}
            />)}</>);
}


export const Chat:React.FC = () => {
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [showNewChatForm, setShowNewChatForm] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<chatTabs>(chatTabs.chats);
    const class_socket = useContext(SocketContext);
    const [chatRooms, setchatRooms] = useState<chats>()
    const [is_listening , setIslistening ] = useState<boolean>(false);

    //test -----
    useEffect(() => {

        console.log("socket event2");

        class_socket.socket.on("chats", (data : chats)=>{ //done 2
            console.log("chats2")
            setchatRooms(data);
        })
        class_socket.socket.on("dm_started", (data : dm_started)=>{
            window.open(`/chat?id=${data.room.id}`, "_self")
        })
        class_socket.socket.on("receive_message", (data : receive_message)=>{
            console.log("receive_message2");
            class_socket.get_chats();
        })
        
        return () => class_socket.socket.removeAllListeners();

        //class_socket.socket.on("room_created", (data : room_created)=>{ //done
        //    console.log("room_created");
        //    console.log(data)
        //})
        //class_socket.socket.on("user_left", (data : user_left)=>{ //done
        //    console.log("user_left");
        //    console.log(data)
        //})
//
        //class_socket.socket.on("user_joined", (data : user_joined)=>{ //done
        //    console.log("user_joined");
        //    console.log(data)
        //})
        //class_socket.socket.on("room_deleted", (data : {id : string})=>{ //done
        //    console.log("room_deleted");
        //    console.log(data.id)
        //})
        //class_socket.socket.on("password_set", (data : management_password)=>{ //done
        //    console.log("password_set");
        //    console.log(data)
        //})
        //class_socket.socket.on("password_removed", (data : management_password)=>{ //done
        //    console.log("password_removed");
        //    console.log(data)
        //})
        //
        //class_socket.socket.on("admin_added", (data : management_memeber)=>{ //done
        //    console.log("admin_added");
        //    console.log(data)
        //})
        //class_socket.socket.on("admin_removed", (data : management_memeber)=>{ //done
        //    console.log("admin_removed");
        //    console.log(data)
        //})
        //class_socket.socket.on("user_banned", (data : management_memeber)=>{ //done
        //    console.log("user_banned");
        //    console.log(data)
        //})
        //class_socket.socket.on("user_unbanned", (data : user_unbanned)=>{ //done
        //    console.log("user_unbanned");
        //    console.log(data)
        //})
        //class_socket.socket.on("user_muted", (data : user_muted)=>{//done
        //    console.log("user_muted");
        //    console.log(data)
        //})
        //class_socket.socket.on("user_unmuted", (data : management_memeber)=>{//done
        //    console.log("user_unmuted");
        //    console.log(data)
        //})
        //class_socket.socket.on("message_deleted", (data : message_deleted)=>{ //done
        //    console.log("message_deleted");
        //    console.log(data)
        //})
        //class_socket.socket.on("members", (data : user_info[])=>{ //done
        //    console.log("members");
        //    console.log(data)
        //})
        //return () => class_socket.socket.removeAllListeners();
    },[])
    //test -----


    useEffect(() => {
        class_socket.get_chats();

        //on mount
        window.addEventListener('resize', () => setScreenWidth(window.innerWidth));
    }, []);

    return (
        <main id="chatPage">
             <button style={{color: `black`}}onClick={() =>{
                class_socket.start_dm("cl71t41qe23023ndu6vw56kdmf");
            }}>start_dm</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.get_chats();
            }}>get_chats</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.send_message({rid : "cl70q7x029144l3u81chjqn0o", msg :"jgfgfgfgfg b"});
            }}>send_message</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.create_room({name : "hicham room",is_private:false, uids :["cl71rzju21859ndu603271qm1"]});
            }}>create room</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.delete_room({id : "cl4jv5f3d0369ohsmoae83lyo"});
            }}>delete_room</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.remove_member({uid : "cl4lebw5j0133yrsms9le0c75", rid : "cl4lidmy50103ojsm2ftzgyw4"});
            }}>remove_member</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.join_room({id : "cl4lidmy50103ojsm2ftzgyw4"});
            }}>join_room</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.leave_room({id : "cl4lidmy50103ojsm2ftzgyw4"});
            }}>leave_room</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.add_member({uid : "cl4lebw5j0133yrsms9le0c75", rid : "cl4lidmy50103ojsm2ftzgyw4"});
            }}>add_member</button>

            <button style={{color: `black`}} onClick={() =>{
                class_socket.set_password({id : "cl4juxk0d0176ohsm1x6d39sn", new_password : "Walidbensaid123$"});
            }}>set_password</button>
            <br/>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.change_password({id : "cl4juxk0d0176ohsm1x6d39sn", new_password : "Awedfdffddfg2123$", old_password : "Walidbensaid123$"});
            }}>change_password</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.remove_password({id : "cl4juxk0d0176ohsm1x6d39sn",  old_password : "Awedfdffddfg2123$"});
            }}>remove_password</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.add_admin({uid : "cl4jsuwd500332tsm3kb2eyyb",  rid : "cl4k0xa1f66734xsmzhxz40gh"});
            }}>add_admin</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.remove_admin({uid : "cl4jsuwd500332tsm3kb2eyyb",  rid : "cl4k0xa1f66734xsmzhxz40gh"});
            }}>remove_admin</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.ban_user({uid : "cl4lebw5j0133yrsms9le0c75",  rid : "cl4lidmy50103ojsm2ftzgyw4"});
            }}>ban_user</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.unban_user({uid : "cl4lebw5j0133yrsms9le0c75",  rid : "cl4lidmy50103ojsm2ftzgyw4"});
            }}>unban_user</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.mute_user({uid : "cl4lebw5j0133yrsms9le0c75",  rid : "cl4lidmy50103ojsm2ftzgyw4", mute_period:"15M"});
            }}>mute_user</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.unmute_user({uid : "cl4lebw5j0133yrsms9le0c75",  rid : "cl4lidmy50103ojsm2ftzgyw4"});
            }}>unmute_user</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.delete_message({id : "cl4k23j4s0738ydsm45l5at7g",  rid : "cl4k0xa1f66734xsmzhxz40gh"});
            }}>delete_message</button>
            <br/>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.get_members({id : "cl4jtlov200862tsmzhczxiq5"});
            }}>get_members</button>

            <button style={{color: `black`}} onClick={() =>{
                class_socket.get_messages({id : "cl6xxzbo80577v4u8i67s9xcz"});
            }}>get_messages</button> 
        



            
            <div className='container'>
                <div className="row chat">
                    {((screenWidth < 767.98 && !showNewChatForm && searchParams.get("id") === null)
                        || screenWidth >= 767.98) && <div className="col-sm-12 col-md-5 col-lg-4 chats">
                        <div className="chatOptions">
                            <form id="chatSearch">
                                <input type="text" placeholder="Search for chat"/>
                                <FontAwesomeIcon icon={faSearch}/>
                            </form>
                            <button id="newMessage" title="New chat" onClick={() => setShowNewChatForm(true)}>
                                <FontAwesomeIcon icon={faCommentMedical}/>
                            </button>
                        </div>
                        <ul id="chatTabs">
                            <li id="chats"
                                onClick={() => setActiveTab(chatTabs.chats)}
                                className={activeTab === chatTabs.chats ? "active" : undefined}>
                                    Chats
                            </li>
                            <li id="joinedGroups"
                                onClick={() => setActiveTab(chatTabs.joinedGroups)}
                                className={activeTab === chatTabs.joinedGroups ? "active" : undefined}>
                                    Joined Groups
                            </li>
                            <li id="groups"
                                onClick={() => setActiveTab(chatTabs.otherGroups)}
                                className={activeTab === chatTabs.otherGroups ? "active" : undefined}>
                                    Other Groups
                            </li>
                        </ul>
                        <div className="chatRooms">
                            <ListChats
                                tab={activeTab}
                                onSelectItem={() => setShowNewChatForm(false)}
                                activeChat={searchParams.get("id")}
                                rooms={chatRooms}/>
                        </div>
                    </div>}
                    {((screenWidth < 767.98 && (showNewChatForm || searchParams.get("id") !== null))
                        || screenWidth >= 767.98) && <div className="col room">
                        {!showNewChatForm && searchParams.get("id") === null && <ChatHome onClick={() => setShowNewChatForm(true)}/>}
                        {!showNewChatForm && searchParams.get("id") !== null && <ChatRoom roomId={searchParams.get("id")!} />}
                        {showNewChatForm && <CreateNewChat onClose={() => setShowNewChatForm(false)}/>}
                    </div>}
                </div>
            </div>
        </main>);
}