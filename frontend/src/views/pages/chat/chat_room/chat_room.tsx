import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { chat_data } from "test_data/chat_data";
import { Chat_msg } from "views/pages/chat/chat_msg/chat_msg";
import { BgVectors } from "assets";
import { useState } from "react";
import { ChatRoomSettings } from "views/pages/chat/chat_room_settings/chat_room_settings";


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

const ChatRoomBody:React.FC = () => {
    return <div id="chatRoomBody" style={{backgroundImage: `url(${BgVectors})`}}>
        { chat_data && chat_data.map (({sender_user, image, msg, time}, k ) => 
            <Chat_msg
                key={k}
                display_image={(chat_data[k - 1] && chat_data[k].sender_user === chat_data[k - 1].sender_user) ? true : false }
                sender_user={sender_user}
                image = {image}
                msg={msg}
                time={time}
            />
        )}
    </div>;
}


const ChatRoomFooter:React.FC = () => {
    return <div id="chatRoomFooter">
       <form id="messageForm">
            <input type="text" placeholder="Type your Message Here"/>
            <button id="sendMessage">
                <FontAwesomeIcon icon={faPaperPlane}/>
                Send
            </button>
        </form>
    </div>;
}

export const ChatRoom:React.FC<{roomId: string}> = ({roomId}) => {
    const [showSettings, setShowSettings] = useState(false);
    const navigate = useNavigate();

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
            <ChatRoomBody/>
            <ChatRoomFooter/>
        </section>}
    </>
    );
}