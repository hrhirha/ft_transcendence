import { Chats, joinedGroups } from "test_data/roomchatdata";
import { ChatRoom } from "views/pages/chat/chat_room/chat_room";
import  {ChatRoomItem }  from "views/pages/chat/chatroom_item/chatroom_item";
import {faCommentMedical, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreateNewChat } from "views/pages/chat/create_chat/create_chat";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatHomeVector, NoConversations } from "assets";
import { Socket } from "socket";
import { management_memeber, chats, dm_started, management_password, receive_message, room_created, user_joined, user_left, user_unbanned, user_muted, message_deleted, user_info, messages } from "socket/interface";


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

const ListChats:React.FC<{tab: chatTabs, activeChat: string | null, onSelectItem: Function}> = ({tab, activeChat, onSelectItem}) => {
    const navigate = useNavigate();
    let chats: any = Chats;
    if (tab === chatTabs.joinedGroups)
    {
        chats = joinedGroups;
    }
    else if (tab === chatTabs.otherGroups)
    {
        chats = [];
    }
    if (chats.length === 0)
    {
        return (
            <div className="noConversations">
                <img src={NoConversations} alt="empty chat"/>
                <span>No Conversations Here</span>
            </div>
        );
    }
    return (<>{chats.map((chat: any, index: any) => 
            <ChatRoomItem
                key={index}
                isChannel={chatTabs.chats !== tab}
                joined={chatTabs.chats === tab}
                avatar={chat.image}
                fullName={chat.username}
                lastMsg={chatTabs.chats !== tab ? `${(index + 2) * 5} members` :  chat.last_msg}
                nbNotifs={chat.nbr_msg_not_read}
                timeLastMsg={chat.time_last_msg}
                active={chat.id === activeChat}
                onClick={() => {
                    onSelectItem();
                    navigate({
                        pathname: '/chat',
                        search: `?id=${chat.id}`,
                    }, {replace: true});
                }}
            />)}</>);
}

const class_socket =new Socket(); //test


export const Chat:React.FC = () => {
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [showNewChatForm, setShowNewChatForm] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<chatTabs>(chatTabs.chats);


    //test -----
    useEffect(() => {
        class_socket.socket.on("chats", (data : chats)=>{ //done
            console.log("chats : ");
            console.log(data)
        })
        class_socket.socket.on("receive_message", (data : receive_message)=>{ //done
            console.log("receive_message");
            console.log(data)
        })

        class_socket.socket.on("room_created", (data : room_created)=>{ //done
            console.log("room_created");
            console.log(data)
        })

        class_socket.socket.on("user_left", (data : user_left)=>{ //done
            console.log("user_left");
            console.log(data)
        })

        class_socket.socket.on("user_joined", (data : user_joined)=>{ //done
            console.log("user_joined");
            console.log(data)
        })
        class_socket.socket.on("room_deleted", (data : {id : string})=>{ //done
            console.log("room_deleted");
            console.log(data.id)
        })
        class_socket.socket.on("password_set", (data : management_password)=>{ //done
            console.log("password_set");
            console.log(data)
        })
        class_socket.socket.on("password_removed", (data : management_password)=>{ //done
            console.log("password_removed");
            console.log(data)
        })
        class_socket.socket.on("dm_started", (data : dm_started)=>{ //done
            console.log("dm_started");
            console.log(data)
        })
        class_socket.socket.on("admin_added", (data : management_memeber)=>{ //done
            console.log("admin_added");
            console.log(data)
        })
        class_socket.socket.on("admin_removed", (data : management_memeber)=>{ //done
            console.log("admin_removed");
            console.log(data)
        })
        class_socket.socket.on("user_banned", (data : management_memeber)=>{ //done
            console.log("user_banned");
            console.log(data)
        })
        class_socket.socket.on("user_unbanned", (data : user_unbanned)=>{ //done
            console.log("user_unbanned");
            console.log(data)
        })
        class_socket.socket.on("user_muted", (data : user_muted)=>{//done
            console.log("user_muted");
            console.log(data)
        })
        class_socket.socket.on("user_unmuted", (data : management_memeber)=>{//done
            console.log("user_unmuted");
            console.log(data)
        })
        class_socket.socket.on("message_deleted", (data : message_deleted)=>{ //done
            console.log("message_deleted");
            console.log(data)
        })
        class_socket.socket.on("messages", (data : messages[])=>{ //done
            console.log("messages");
            console.log(data)
        })
        class_socket.socket.on("members", (data : user_info[])=>{ //done
            console.log("members");
            console.log(data)
        })
        return () => class_socket.socket.removeAllListeners();
    },[class_socket.socket])
    //test -----


    useEffect(() => {
        //on mount
        window.addEventListener('resize', () => setScreenWidth(window.innerWidth));
    }, []);

    return (
        <main id="chatPage">
            {/* <button style={{color: `black`}}onClick={() =>{
                class_socket.start_dm("cl4motzn00033r8sleqn0c4a8");
            }}>start_dm</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.get_chats();
            }}>get_chats</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.send_message({rid : "cl4mowo080112r8sl1ydozsbf", msg :"Hello1"});
            }}>send_message</button>
            <button style={{color: `black`}} onClick={() =>{
                class_socket.create_room({name : "walidroom",is_private:false, uids :["cl4lebw5j0133yrsms9le0c75"]});
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
                class_socket.get_messages({id : "cl4lidmy50103ojsm2ftzgyw4"});
            }}>get_messages</button> */}
        



            
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
                                activeChat={searchParams.get("id")}/>
                        </div>
                    </div>}
                    {((screenWidth < 767.98 && (showNewChatForm || searchParams.get("id") !== null))
                        || screenWidth >= 767.98) && <div className="col room">
                        {!showNewChatForm && searchParams.get("id") === null && <ChatHome onClick={() => setShowNewChatForm(true)}/>}
                        {!showNewChatForm && searchParams.get("id") !== null && <ChatRoom roomId={searchParams.get("id")!}/>}
                        {showNewChatForm && <CreateNewChat onClose={() => setShowNewChatForm(false)}/>}
                    </div>}
                </div>
            </div>
        </main>);
}