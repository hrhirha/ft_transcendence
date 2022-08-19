import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { chat_data } from "test_data/chat_data";
import { Chat_msg } from "views/pages/chat/chat_msg/chat_msg";
import { BgVectors } from "assets";
import { useContext, useEffect, useState } from "react";
import { ChatRoomSettings } from "views/pages/chat/chat_room_settings/chat_room_settings";
import {messages, receive_message } from "socket/interface";
import { SocketContext } from "index";


interface HeaderProps {
    username: string,
    image: string,
    status: string,
    showSettings: Function,
    onClose: Function,
}

const ChatRoomHeader = (Props : HeaderProps) => {
    return (
    <div id="chatRoomHeader">
        <div className="userInfos" onClick={() => Props.showSettings()}>
            <CircleAvatar avatarURL={Props.image} dimensions={45} showStatus={true}/>
            <div className='dataRow'>
                <span className='userName'>{Props.username}</span>
                <span className='status'>{Props.status}</span>
            </div>
        </div>
        <button id="closeChatRoom" onClick={() => Props.onClose()} title="close">
            <FontAwesomeIcon icon={faClose}/>
        </button>
    </div>
    );
}

const ChatRoomBody:React.FC<{messages: messages[]}> = ({messages}) => {
    return <div id="chatRoomBody" style={{backgroundImage: `url(${BgVectors})`}}>
        { messages && messages.map ((message : messages, k ) => 
            <Chat_msg
                key={k}
                display_image={(messages[k - 1] && messages[k].user.id === messages[k - 1].user.id) ? true : false }
                sender_user={message.user.id}
                image = {message.user.imageUrl}
                msg={message.msg}
                time={message.timestamp}
            />
        )}
    </div>;
}


const ChatRoomFooter:React.FC<{send_message : Function}> = ({send_message}) => {
    const [msg, setMsg] = useState<string>("");

    return <div id="chatRoomFooter">
       <form id="messageForm">
            <input type="text" placeholder="Type your Message Here" value={msg} onChange={(e)=>setMsg(e.target.value)}/>
            <button id="sendMessage" onClick={(e) =>{
                e.preventDefault();
                send_message(msg);
                setMsg("")
            }}>
                <FontAwesomeIcon icon={faPaperPlane}/>
                Send
            </button>
        </form>
    </div>;
}

export const ChatRoom:React.FC<{roomId: string}> = ({roomId}) => {
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();
    
    const class_socket = useContext(SocketContext);
    const [messages, setmessages] = useState<messages[]>();

    useEffect(() => {

        class_socket.socket.on("messages", (data : messages[])=>{ 
            setmessages(data)
        })

        class_socket.socket.on("receive_message", (data : receive_message)=>{
            if (roomId != null && roomId == data.room.id)
                class_socket.get_messages({id : data.room.id});
        })

        return () => class_socket.socket.removeAllListeners();

    },[class_socket.socket])

    useEffect(() => {
        if (roomId != null)
            class_socket.get_messages({id : roomId});
    },[])
    

    return (
        <>
        {showSettings && <ChatRoomSettings roomId={roomId} onClose={() => setShowSettings(false)}/>}
        {!showSettings && <section id="chatRoom">
            <ChatRoomHeader
                username="Jhon don"
                image="https://staticg.sportskeeda.com/editor/2022/01/f1c08-16420302985959-1920.jpg"
                status="last seen yesterday 2.30 PM"
                onClose={() => navigate("/chat", {replace : true})}
                showSettings={() => setShowSettings(true)}
            />
            <ChatRoomBody messages={messages} />
            <ChatRoomFooter send_message={(msg : string) => class_socket.send_message({rid : roomId, msg :msg})}/>
        </section>}
    </>
    );
}