// import { useNavigate } from "react-router-dom";
import { Chats, joinedGroups } from "../../../test_data/roomchatdata";
import { NavBar } from "../../components/navbar/navbar";
import { ChatRoom } from "./chat_room/chat_room";
import  {ChatRoomItem }  from "./chatroom_item/chatroom_item";
import {faCommentMedical, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreateNewChat } from "./create_chat/create_chat";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatHomeVector, NoConversations } from "../../../assets";
import { Socket } from "../../../socket";
import { chats, dm_started, leave_call, receive_message, room_created } from "../../../socket/interface";

// interface Props {
//     username: string,
//     image: string,
// }

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
                lastMsg={chat.last_msg}
                nbNotifs={chat.nbr_msg_not_read}
                timeLastMsg={chat.time_last_msg}
                active={chat.id === activeChat}
                onClick={() => {
                    onSelectItem();
                    navigate({
                        pathname: '/chat',
                        search: `?id=${chat.id}`,
                    });
                }}
            />)}</>);
}

const class_socket =new Socket(); //test


export const Chat:React.FC = () => {
    const [showNewChatForm, setShowNewChatForm] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<chatTabs>(chatTabs.chats);


    //test -----
    useEffect(() => {
        class_socket.socket.on("chats", (data : chats)=>{ //done
            console.log("chats : ");
            console.log(data)
        })
        class_socket.socket.on("receive_message", (data : receive_message)=>{ //dane
            console.log("receive_message");
            console.log(data)
        })

        class_socket.socket.on("leave_call", (data : leave_call)=>{
            console.log("leave_call");
            console.log(data.id)
        })
        class_socket.socket.on("user_joined", (data : any)=>{
            console.log("user_joined");
            console.log(data)
        })
        class_socket.socket.on("user_left", (data : any)=>{
            console.log("user_left");
            console.log(data)
        })
        class_socket.socket.on("user_leave_call", (data : any)=>{
            console.log("user_leave_call");
            console.log(data)
        })
        class_socket.socket.on("room_created", (data : room_created)=>{
            console.log("room_created");
            console.log(data)
        })
        class_socket.socket.on("room_deleted", (data : any)=>{
            console.log("room_deleted");
            console.log(data)
        })
        class_socket.socket.on("password_set", (data : any)=>{
            console.log("password_set");
            console.log(data)
        })
        class_socket.socket.on("password_changed", (data : any)=>{
            console.log("password_changed");
            console.log(data)
        })
        class_socket.socket.on("password_removed", (data : any)=>{
            console.log("password_removed");
            console.log(data)
        })
        class_socket.socket.on("dm_started", (data : dm_started)=>{
            console.log("dm_started");
            console.log(data)
        })
        class_socket.socket.on("admin_added", (data : any)=>{
            console.log("admin_added");
            console.log(data)
        })
        class_socket.socket.on("admin_removed", (data : any)=>{
            console.log("admin_removed");
            console.log(data)
        })
        class_socket.socket.on("user_banned", (data : any)=>{
            console.log("user_banned");
            console.log(data)
        })
        class_socket.socket.on("user_unbanned", (data : any)=>{
            console.log("user_unbanned");
            console.log(data)
        })
        class_socket.socket.on("user_muted", (data : any)=>{
            console.log("user_muted");
            console.log(data)
        })
        class_socket.socket.on("user_unmuted", (data : any)=>{
            console.log("user_unmuted");
            console.log(data)
        })
        class_socket.socket.on("message_deleted", (data : any)=>{
            console.log("message_deleted");
            console.log(data)
        })
        class_socket.socket.on("messages", (data : any)=>{
            console.log("messages");
            console.log(data)
        })
    },[class_socket.socket])
    //test -----

    return (
    <main id="chatPage">
        <NavBar />

        <button style={{color: `black`}}onClick={() =>{
            class_socket.start_dm("cl4ijebhq00120xsrfeiy6bkb");
        }}>start_dm</button>
        <button style={{color: `black`}} onClick={() =>{
            class_socket.get_chats();
        }}>get_chats</button>
        <button style={{color: `black`}} onClick={() =>{
            class_socket.send_message({rid : "cl4imx8c60085bhsrpmxavy94", msg :"test"});
        }}>send_message</button>
        <button style={{color: `black`}} onClick={() =>{
            class_socket.create_room({name : "walidroom",is_private:false, uids :["cl4ijebhq00120xsrfeiy6bkb"]});
        }}>create room</button>
        <button style={{color: `black`}} onClick={() =>{
            class_socket.delete_room({id : "cl4imx8960036bhsrjccw1ec6"});
        }}>delete_room</button>
        <button style={{color: `black`}} onClick={() =>{
            class_socket.remove_member({uid : "cl4ijebhq00120xsrfeiy6bkb", rid : "cl4ilpr2k1101o4srutqwwkld"});
        }}>remove_member</button>
        <button style={{color: `black`}} onClick={() =>{
            class_socket.join_room({id : "cl4ijk9br06800xsrtkrgyzvr"});
        }}>join_room</button>
        <button style={{color: `black`}} onClick={() =>{
            class_socket.leave_room({id : "cl4ijk9br06800xsrtkrgyzvr"});
        }}>leave_room</button>
        <button style={{color: `black`}} onClick={() =>{
            class_socket.add_member({uid : "cl4ijebhq00120xsrfeiy6bkb", rid : "cl4ilpr2k1101o4srutqwwkld"});
        }}>add_member</button>



        
        <div className='container'>
            <div className="row chat">
                <div className="col-sm-12 col-md-5 col-lg-4">
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
                </div>
                <div className="col">
                    {!showNewChatForm && searchParams.get("id") === null && <ChatHome onClick={() => setShowNewChatForm(true)}/>}
                    {!showNewChatForm && searchParams.get("id") !== null && <ChatRoom roomId={searchParams.get("id")!}/>}
                    {showNewChatForm && <CreateNewChat onClose={() => setShowNewChatForm(false)}/>}
                </div>
            </div>
        </div>
    </main>
    );
}