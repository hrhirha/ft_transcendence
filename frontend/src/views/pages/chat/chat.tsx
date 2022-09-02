import { ChatRoom } from "views/pages/chat/chat_room/chat_room";
import  {ChatRoomItem }  from "views/pages/chat/chatroom_item/chatroom_item";
import {faCommentMedical, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CreateNewChat } from "views/pages/chat/create_chat/create_chat";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatHomeVector, NoConversations } from "assets";
import { management_memeber, chats, dm_started, management_password, receive_message, room_created, user_joined, user_left, user_unbanned, user_muted, message_deleted, user_info, messages, dms, info_room, others } from "controller/chat_socket/interface";
import { getIDQuery, history, SocketContext } from "index";

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
                active={room.id === activeChat}
                type={room.type}
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
                active={other.id === activeChat}
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
                status = {dms.user.status}
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
    const [activeTab, setActiveTab] = useState<chatTabs>(chatTabs.chats);
    const class_socket = useContext(SocketContext);
    const [chatRooms, setchatRooms] = useState<chats>();
    const [filteredrooms, setFilteredRooms] = useState<chats>();
    const navigate = useNavigate();

    const filterSearch = (e) =>{
        e.preventDefault();
        setFilteredRooms(() => {
            if(e.target.value.trim() == "")
                return null;
            return {
               dms: chatRooms.dms.filter(chat => chat.user.fullName.toLowerCase().includes(e.target.value.toLowerCase())),
               rooms: chatRooms.rooms.filter(chat => chat.name.toLowerCase().includes(e.target.value.toLowerCase())), 
               others: chatRooms.others.filter(chat => chat.name.toLowerCase().includes(e.target.value.toLowerCase()))
            }
        })
    }
    //test -----
    useEffect(() => {

        class_socket.get_chats();

        class_socket.socket.on("dm_started", (data : dm_started)=>{
            setShowNewChatForm(false);
            navigate({
                pathname: '/chat',
                search: `?id=${data.room.id}`,
            }, {replace: true});
            class_socket.get_chats();
        }).on("room_created", (data : room_created)=>{
            setShowNewChatForm(false);
            navigate({
                pathname: '/chat',
                search: `?id=${data.id}`,
            }, {replace: true});
            class_socket.get_chats();
            
        }).on("status_update", () =>{
            class_socket.get_chats();
            if(getIDQuery() !== null)
                class_socket.get_messages({id : getIDQuery()});
        }).on("chats", (data : chats)=>{
            setchatRooms(data);

            if(data.dms.find(d => d.room.id ===  getIDQuery()))
                setActiveTab(chatTabs.chats);
            else if(data.rooms.find(d => d.id ===  getIDQuery()))
                setActiveTab(chatTabs.joinedGroups);
            else if(data.others.find(d => d.id ===  getIDQuery()))
                setActiveTab(chatTabs.otherGroups);
        }).on("messages", (data : messages)=>{
            class_socket.get_chats();
        }).on("receive_message", (data : receive_message)=>{
             class_socket.get_chats();
        }).on("room_deleted", (data : {id : string})=> {
            if(getIDQuery() !== null && getIDQuery() === data.id)
                navigate(`/chat`, {replace: true})
            class_socket.get_chats();
        }).on("user_banned", (data : management_memeber)=>{
            //if(getIDQuery() === data.rid && JSON.parse(window.localStorage.getItem("user")).id === data.uid)
            //    navigate(`/chat`, {replace: true});
            //class_socket.get_chats();
        })
        
        //on mount
        window.addEventListener('resize', () => setScreenWidth(window.innerWidth));
        //return () => class_socket.socket.removeAllListeners();

    },[])

    return (
        <main id="chatPage">    
            <div className='container'>
                <div className="row chat">
                    {((screenWidth < 767.98 && !showNewChatForm &&  getIDQuery() === null)
                        || screenWidth >= 767.98) && <div className="col-sm-12 col-md-5 col-lg-4 chats">
                        <div className="chatOptions">
                            <form id="chatSearch" onSubmit={(e) => e.preventDefault()}>
                                <input type="text" placeholder="Search for chat"  onChange={(e) => filterSearch(e)}/>
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
                                activeChat={ getIDQuery()}
                                rooms={(filteredrooms != null) ? filteredrooms :chatRooms }/>
                        </div>
                    </div>}
                    {((screenWidth < 767.98 && (showNewChatForm ||  getIDQuery() !== null))
                        || screenWidth >= 767.98) && <div className="col room">
                        {!showNewChatForm &&  getIDQuery() === null && <ChatHome onClick={() => setShowNewChatForm(true)}/>}
                        {!showNewChatForm &&  getIDQuery() !== null && <ChatRoom/>}
                        {showNewChatForm && <CreateNewChat onClose={() => setShowNewChatForm(false)}/>}
                    </div>}
                </div>
            </div>
        </main>);
}