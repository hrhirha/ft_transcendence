import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faKey, faLock, faLockOpen} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { UserSearchForm } from "../../../components/user_search/user_search";

enum chatTypes {
    public, private, protected, none
}

interface Props {
    username: string,
    image: string,
    status: string
}


const PrivateChat = () => {
    return (
    <form id="newPrivateChat">
        <h6><FontAwesomeIcon icon={faLock}/>Private Chat</h6>
        <UserSearchForm callback={(i: any) => {console.log(i)}}/>
        <button id="closeChatRoom" title="close">
            <FontAwesomeIcon icon={faClose}/>
        </button>
    </form>
    );
}


const PublicChat = () => {
    return (
    <form id="newPublicChat">
        <h6>Private Chat</h6>
        <UserSearchForm callback={(i: string) => {console.log(i)}}/>
        <div className="usersAdded">
            
        </div>
        <button id="closeChatRoom" title="close">
            <FontAwesomeIcon icon={faClose}/>
        </button>
    </form>
    );
}

export const CreateNewChat:React.FC = () => {
    const [chatType, setChatType] = useState(chatTypes.none);
    
    return (
    <section id="createNewChat">
        {chatType === chatTypes.none
        &&  <ul>
                <li><button id="newPrivateChat" onClick={() => setChatType(chatTypes.private)}><FontAwesomeIcon icon={faLock}/> New private chat</button></li>
                <li><button id="newPublicChat" onClick={() => setChatType(chatTypes.public)}><FontAwesomeIcon icon={faLockOpen}/> New public chat</button></li>
                <li><button id="newProtectedChat" onClick={() => setChatType(chatTypes.protected)}><FontAwesomeIcon icon={faKey}/> New protected chat</button></li>
            </ul>}
        {chatType === chatTypes.private && <PrivateChat />}
        {chatType === chatTypes.public && <PublicChat />}
        {chatType === chatTypes.protected && <PrivateChat />}
    </section>
    );
}