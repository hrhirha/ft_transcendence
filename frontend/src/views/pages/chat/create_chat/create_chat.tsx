import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { type } from "@testing-library/user-event/dist/type";

enum chatType {
    public, private, protected
}

interface Props {
    username: string,
    image: string,
    status: string
}

const UserSearchForm = () => {
    return (
    <form id="searchUser">
        <input id="username" type="text" placeholder="username or email"/>
        <div id="suggestions">
            <span id="username">Full Name</span>
            <span id="username">Full Name 1</span>
            <span id="username">Full Name 2</span>
        </div>
    </form>
    );
}

const PrivateChat = () => {
    return (
    <form id="newPrivateChat">
        <h6>Private Chat</h6>
        <UserSearchForm />
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
        <UserSearchForm />
        <div className="usersAdded">
            <span id="username">Full Name</span>
            <span id="username">Full Name 1</span>
            <span id="username">Full Name 2</span>
        </div>
        <button id="closeChatRoom" title="close">
            <FontAwesomeIcon icon={faClose}/>
        </button>
    </form>
    );
}

export const CreateNewChat:React.FC = () => {
    
    return (
    <section id="createNewChat">
        <PrivateChat />
    </section>
    );
}