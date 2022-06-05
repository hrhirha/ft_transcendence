// import { useNavigate } from "react-router-dom";
import { Chats, joinedGroups } from "../../../test_data/roomchatdata";
import { NavBar } from "../../components/navbar/navbar";
import { ChatRoom } from "./chat_room/chat_room";
import  {ChatRoomItem }  from "./chatroom_item/chatroom_item";
import {faCommentMedical, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreateNewChat } from "./create_chat/create_chat";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatHomeVector } from "../../../assets";

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
    return (<>{chats.length > 0 && chats.map((chat: any, index: any) => 
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


export const Chat:React.FC = () => {
    const [showNewChatForm, setShowNewChatForm] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<chatTabs>(chatTabs.chats);
    return (
    <main id="chatPage">
        <NavBar />
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