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
import { join_invite, leave_call, receive_message } from "../../../socket/interface";

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
        class_socket.socket.on("chats", (data : any)=>{
            console.log(data)
        })
        class_socket.socket.on("receive_message", (data : receive_message)=>{
            console.log(data.user.username)
        })
        class_socket.socket.on("join_invite", (data : join_invite)=>{
            console.log(data)
        })
        class_socket.socket.on("leave_call", (data : leave_call)=>{
            console.log(data.id)
        })
        class_socket.socket.on("user_joined", (data : string)=>{
            console.log(data)
        })
        class_socket.socket.on("user_left", (data : string)=>{
            console.log(data)
        })
    },[class_socket.socket])
    //test -----

    return (
    <main id="chatPage">
        <NavBar />

        <button onClick={() =>{
            class_socket.start_dm("cl4h09o9e0208edsndp62jcyk");
        }}>start_dm</button>
        <button onClick={() =>{
            class_socket.get_chats();
        }}>get_chats</button>
        <button onClick={() =>{
            class_socket.send_message({rid : "cl4h2oyfy0372edsnq475xaz5", msg :"aloooooo"});
        }}>send_message</button>
        <button onClick={() =>{
            class_socket.create_room({name : "walidroom",is_private:false, uids :["cl4h09o9e0208edsndp62jcyk"]});
        }}>create room</button>
        <button onClick={() =>{
            class_socket.delete_room({id : "cl4h891gg32944wsna1fxffb6"});
        }}>delete_room</button>
        <button onClick={() =>{
            class_socket.remove_member({uid : "cl4h09o9e0208edsndp62jcyk", rid : "cl4h8byh336374wsn1uelai1h"});
        }}>remove_member</button>
        <button onClick={() =>{
            class_socket.join_room({id : "cl4hbgqpq85214wsnjmq4w368"});
        }}>join_room</button>
        <button onClick={() =>{
            class_socket.leave_room({id : "cl4hbgqpq85214wsnjmq4w368"});
        }}>leave_room</button>
        <button onClick={() =>{
            class_socket.add_member({uid : "cl4h09o9e0208edsndp62jcyk", rid : "cl4h8byh336374wsn1uelai1h"});
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