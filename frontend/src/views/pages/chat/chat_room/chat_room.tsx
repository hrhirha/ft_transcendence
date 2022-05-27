import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { chat_data } from "../../../../test_data/chat_data";
import { Chat_msg } from "../chat_msg/chat_msg";


interface Props {
    username: string,
    image: string,
    status: string,
    
}

const ChatRoomHeader = (Props : Props) => {
    return (
    <div id="chatRoomHeader">
        <div className="userInfos">
            <CircleAvatar avatarURL={Props.image} dimensions={45}/>
            <div className='dataRow'>
                <span className='userName'>{Props.username}</span>
                <span className='status'>{Props.status}</span>
            </div>
        </div>
        <button id="closeChatRoom" title="close">
            <FontAwesomeIcon icon={faClose}/>
        </button>
    </div>
    );
}

const ChatRoomBody:React.FC = () => {
    return <div id="chatRoomBody">
        { chat_data && chat_data.map (({sender_user, image, msg, time}, k ) => (
            <Chat_msg
                key={k}
                display_image={(chat_data[k - 1] && chat_data[k].sender_user === chat_data[k - 1].sender_user) ? true : false }
                sender_user={sender_user}
                image = {image}
                msg={msg}
                time={time}
            />
        ))}
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

export const ChatRoom:React.FC = () => {
    const navigate = useNavigate();
    return (
    <section id="chatRoom">
        <ChatRoomHeader username="Jhon don" image="https://staticg.sportskeeda.com/editor/2022/01/f1c08-16420302985959-1920.jpg" status="last seen yesterday 2.30 PM"/>
        <ChatRoomBody/>
        <ChatRoomFooter/>
    </section>
    );
}