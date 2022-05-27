import { useNavigate } from "react-router-dom";
import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faTrashCan, faPaperPlane} from "@fortawesome/free-solid-svg-icons";


interface Props {
    username: string,
    image: string,
    status: string,
    
}

const ChatRoomHeader = (Props : Props) => {
    return (
    <div id="chatRoomHeader">
        <CircleAvatar avatarURL={Props.image} dimensions={45}/>
        <div className='dataRow'>
            <span className='userName'>{Props.username}</span>
            <span className='status'>{Props.status}</span>
        </div>
    </div>
    );
}

const ChatRoomBody:React.FC = () => {
    return <div id="chatRoomBody">
        Body
        chat
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