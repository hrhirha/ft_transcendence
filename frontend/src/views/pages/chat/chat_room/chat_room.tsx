import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faComments, faCommentSlash, faGamepad, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { Chat_msg } from "views/pages/chat/chat_msg/chat_msg";
import { BannedFromChat, BgVectors, GroupIcon, NoConversations } from "assets";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatRoomSettings } from "views/pages/chat/chat_room_settings/chat_room_settings";
import { messages, msgs, receive_message, room_msgs } from "controller/chat_socket/interface";
import { getIDQuery, history, SocketContext } from "index";
import { validPassword } from "../create_chat/create_chat";


interface HeaderProps {
    username: string,
    fullName: string,
    image: string,
    status: string,
    showSettings: Function,
    onClose: Function,
}

const JoinChat:React.FC<{room :room_msgs}> = ({room}) => {
    const [isProtected, setIsProtected] = useState<boolean>();
    const [channelPassword, setPassword] = useState<string>("");
    const class_socket = useContext(SocketContext);

    useEffect(() => {
        setIsProtected(room.type === "PROTECTED");
    }, [room]);

    const joinNow = () => {
        class_socket.join_room({id : room.id, password : channelPassword === "" ? null : channelPassword});
    }

    return (
        <div className="joinChat">
            <div className="channelInfos">
                <CircleAvatar avatarURL={GroupIcon} dimensions={100} status={null}/>
                <h3>{room.name}</h3>
                {isProtected && <input type="password" className={validPassword(channelPassword) ? "" : "error"} value={channelPassword} onChange={(e) => setPassword(e.target.value)} placeholder="Channel password"/>}
                <button className="joinBtn" onClick={() => joinNow()}>Join Now</button>
            </div>
        </div>
    );
}

const ChatRoomHeader = (Props : HeaderProps) => {
    const navigate = useNavigate();
    return (
    <div id="chatRoomHeader">
        <div className="userInfos" onClick={() => {
            if (Props.status === "Channel")
                Props.showSettings()
            else
                navigate(`/u/${Props.username}`);
            }}>
            <CircleAvatar avatarURL={Props.status !== "Channel" ? Props.image : GroupIcon} dimensions={45} status={(Props.status !== "Channel" ? Props.status : null)}/>
            <div className='dataRow'>
                <span className='userName'>{Props.fullName}</span>
                <span className='status'>{Props.status}</span>
            </div>
        </div>
        <div className="roomOptions">
            {Props.status !== "Channel" && <button id="inviteToPlay" onClick={() => alert("invite to play")} title="invite to play">
                <FontAwesomeIcon icon={faGamepad}/>
            </button>}
            <button id="closeChatRoom" onClick={() => Props.onClose()} title="close">
                <FontAwesomeIcon icon={faClose}/>
            </button>
        </div>
    </div>
    );
}

const ChatRoomBody:React.FC<{messages: msgs[], roomId: string, chatRef: React.LegacyRef<HTMLDivElement>}> = ({messages, roomId, chatRef}) => {

    const displayUserImage = (prevMsg, msg) => {
        return ((prevMsg && (prevMsg.type === "NOTIFICATION" || prevMsg.user.id !== msg.user.id)) || !prevMsg);
    }

    return <div id="chatRoomBody" style={{backgroundImage: `url(${BgVectors})`}}>
        { messages && messages.map ((message : msgs, k: number ) => 
            <Chat_msg
                chatRef={chatRef}
                key={message.id}
                msgId={message.id}
                roomId={roomId}
                display_image={displayUserImage(messages[k - 1], message)}
                sender_user={message.user.id}
                image = {message.user.imageUrl}
                msg={message.msg}
                time={message.timestamp}
                type={message.type}
            />
        )}
    </div>;
}


const ChatRoomFooter:React.FC<{blocked: boolean, muted: boolean, send_message : Function}> = ({blocked, muted, send_message}) => {
    const [msg, setMsg] = useState<string>("");

    return <div id="chatRoomFooter">
       {!muted && !blocked && <form id="messageForm">
            <input type="text" placeholder="Type your Message Here" value={msg} onChange={(e)=>setMsg(e.target.value.trim() !== "" ? e.target.value : "")}/>
            <button id="sendMessage" onClick={(e) =>{
                e.preventDefault();
                if (msg.trim() !== "") {
                    send_message(msg.trim());
                }
                setMsg("");
            }}>
                <FontAwesomeIcon icon={faPaperPlane}/>
            </button>
        </form>}
        {muted && <div id="muted"><FontAwesomeIcon icon={faCommentSlash} />You are muted, you can't send messages</div>}
        {blocked && <div id="muted"><FontAwesomeIcon icon={faCommentSlash} />You can't send messages</div>}
    </div>;
}

export const ChatRoom:React.FC = () => {
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();
    const class_socket = useContext(SocketContext);
    const [messages, setmessages] = useState<msgs[]>();
    const [roominfo, setRoominfo] = useState<room_msgs>();
    const lastChat = useRef<HTMLDivElement>(null);
    const [scrollOff, setScrollOff] = useState(false);

    useEffect(() => {

        class_socket.socket.on("messages", (data : messages)=>{
            setmessages(data.msgs);
            setRoominfo(data.room);
        }).on("receive_message", (data : receive_message)=>{
            if (getIDQuery() != null && getIDQuery() == data.room.id)
            {
                if(messages != null)
                    setmessages(oldData => [...oldData, data].sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp) ));
                else
                    class_socket.get_messages({id : getIDQuery()});
                setScrollOff(false);
            }
        }).on("message_deleted", ()=>{
            setScrollOff(true);
            class_socket.get_messages({id : getIDQuery()});
        })
    },[]);

    useEffect(() => {
        if (getIDQuery() != null)
            class_socket.get_messages({id : getIDQuery()});
        setShowSettings(false);
    },[history.location.search]);

    useEffect(() => {
        if (lastChat.current !== null && !scrollOff)
            lastChat.current.scrollIntoView({behavior: "smooth"});
    },[messages]);

    if (roominfo !== undefined && roominfo.is_banned)
        return (
            <div className="bannedFromChat">
                <img src={BannedFromChat}/>
                <p>Sorry! you are banned from this channel</p>
                <button onClick={() => navigate("/chat", {replace : true})}>
                    <FontAwesomeIcon icon={faComments}/>
                    Browse Chats
                </button>
            </div>
        );
    if (roominfo !== undefined && messages === undefined)
        return (<JoinChat room={roominfo}/>);
    if (roominfo === undefined)
        return (
            <div className="chatNotFound">
                <img src={NoConversations}/>
                <p>This chat cannot be accessed right now. Please try again later</p>
                <button onClick={() => navigate("/chat", {replace : true})}>
                    <FontAwesomeIcon icon={faComments}/>
                    Browse Chats
                </button>
            </div>
        );
    return (
        <>
        {showSettings && <ChatRoomSettings room= {roominfo} onClose={() => setShowSettings(false)}/>}
        {!showSettings && <section id="chatRoom">
            <ChatRoomHeader
                username={roominfo && ((roominfo.is_channel) ? roominfo.name :roominfo.user.username)}
                fullName={roominfo && ((roominfo.is_channel) ? roominfo.name :roominfo.user.fullName)}
                image= {roominfo && ((roominfo.is_channel) ? null :roominfo.user.imageUrl)}
                status= {roominfo && ((roominfo.is_channel) ? "Channel" :roominfo.user.status)}
                onClose={() => navigate("/chat", {replace : true})}
                showSettings={() => setShowSettings(true)}
            />
            <ChatRoomBody messages={messages} roomId={roominfo.id} chatRef={lastChat}/>
            <ChatRoomFooter blocked={roominfo.user !== undefined && roominfo.user.relation === "BLOCKED"} muted={roominfo.is_muted } send_message={(msg : string) => class_socket.send_message({rid : getIDQuery(), msg :msg})}/>
        </section>}
    </>
    );
}