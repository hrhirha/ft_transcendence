import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose, faKey, faLock, faLockOpen, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { UserSearchForm } from "views/components/user_search/user_search";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { User } from "controller/user/user";
import { SocketContext } from "index";

enum chatTypes {
    public, private, protected, direct, none
}

const UserCheckedCard:React.FC<{avatar: string, fullName: string, onRemove: Function}> = ({avatar, fullName, onRemove}) => {
    return <div className="userCheckedCard">
        <span className="userInfos">
            <CircleAvatar dimensions={25} avatarURL={avatar} showStatus={false}/>
            <h4>{fullName}</h4>
        </span>
        <FontAwesomeIcon icon={faClose} onClick={() => onRemove()} />
    </div>;
}

const DirectMessage:React.FC<{onClose: Function}> = ({onClose}) => {
    const [userSelected, setUserSelected] = useState<User>(null);
    const class_socket = useContext(SocketContext);
    
    return (
    <form id="newDirectMessage" className="creatChatForm">
        <span className="closeForm" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
        <h5><FontAwesomeIcon icon={faLock}/>Private Chat</h5>
        {userSelected === null && <UserSearchForm callback={(selectedUser: User) => setUserSelected(selectedUser)}/>}
        {userSelected !== null
            && <UserCheckedCard
                onRemove={() => setUserSelected(null)}
                avatar={userSelected.imageUrl}
                fullName={userSelected.fullName}
            />}
        {userSelected !== null
            && <button id="submitChat" onClick={(e) => {
                e.preventDefault();
                class_socket.start_dm(userSelected.id)
            }}>
                <FontAwesomeIcon icon={faCheck}/>
                Submit
            </button>}
    </form>
    );
}

const PrivateChannel:React.FC<{onClose: Function}> = ({onClose}) => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    return (
    <form id="newPrivateChannel" className="creatChatForm">
        <span className="closeForm" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
        <h5><FontAwesomeIcon icon={faLockOpen}/>Private channel</h5>
        <input id="chatTitle" className="textInput" type="text" placeholder="channel title" autoComplete="off"/>
        <UserSearchForm callback={(userSelected: User) => {
            console.log(selectedUsers);
            if (selectedUsers.length === 0 || !selectedUsers.find(user => user.id === userSelected.id)) {
                setSelectedUsers(prvUsers => [...prvUsers, userSelected]);
            }
        }}/>
        <div className="usersAdded">
            {selectedUsers.length > 0 && selectedUsers.map((user: User, k: number) => <UserCheckedCard
                key={k}
                onRemove={() => setSelectedUsers(prvResults => prvResults.filter((u: User) => u.id !== user.id))}
                avatar={user.imageUrl}
                fullName={user.fullName}
            />)}
        </div>
        {selectedUsers.length > 0
            && <button id="submitChat" onClick={() => {}}>
                <FontAwesomeIcon icon={faCheck}/>
                Submit
            </button>}
    </form>
    );
}

const PublicChannel:React.FC<{onClose: Function}> = ({onClose}) => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    return (
    <form id="newPublicChannel" className="creatChatForm">
        <span className="closeForm" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
        <h5><FontAwesomeIcon icon={faLockOpen}/>Public channel</h5>
        <input id="chatTitle" className="textInput" type="text" placeholder="channel title" autoComplete="off"/>
        <UserSearchForm callback={(userSelected: User) => {
            console.log(selectedUsers);
            if (selectedUsers.length === 0 || !selectedUsers.find(user => user.id === userSelected.id)) {
                setSelectedUsers(prvUsers => [...prvUsers, userSelected]);
            }
        }}/>
        <div className="usersAdded">
            {selectedUsers.length > 0 && selectedUsers.map((user: User, k: number) => <UserCheckedCard
                key={k}
                onRemove={() => setSelectedUsers(prvResults => prvResults.filter((u: User) => u.id !== user.id))}
                avatar={user.imageUrl}
                fullName={user.fullName}
            />)}
        </div>
        {selectedUsers.length > 0
            && <button id="submitChat" onClick={() => {}}>
                <FontAwesomeIcon icon={faCheck}/>
                Submit
            </button>}
    </form>
    );
}

const ProtectedChannel:React.FC<{onClose: Function}> = ({onClose}) => {
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    return (
    <form id="newProtectedChannel" className="creatChatForm">
        <span className="closeForm" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
        <h5><FontAwesomeIcon icon={faKey}/>Protected channel</h5>
        <input id="chatTitle" className="textInput" type="text" placeholder="channel title" autoComplete="off"/>
        <input id="chatKey" className="textInput" type="password" placeholder="password" autoComplete="off"/>
        <UserSearchForm callback={(userSelected: User) => {
            console.log(selectedUsers);
            if (selectedUsers.length === 0 || !selectedUsers.find(user => user.id === userSelected.id)) {
                setSelectedUsers(prvUsers => [...prvUsers, userSelected]);
            }
        }}/>
        <div className="usersAdded">
            {selectedUsers.length > 0 && selectedUsers.map((user: User, k: number) => <UserCheckedCard
                key={k}
                onRemove={() => setSelectedUsers(prvResults => prvResults.filter((u: User) => u.id !== user.id))}
                avatar={user.imageUrl}
                fullName={user.fullName}
            />)}
        </div>
        {selectedUsers.length > 0
            && <button id="submitChat" onClick={(e) => {
                e.preventDefault();
                console.log(document.getElementById("chatKey")!.nodeValue);
                console.log(document.getElementById("chatTitle")!.getAttribute("value"));
            }}>
                <FontAwesomeIcon icon={faCheck}/>
                Submit
            </button>}
    </form>
    );
}

export const CreateNewChat:React.FC<{onClose: Function}> = ({onClose}) => {
    const [chatType, setChatType] = useState(chatTypes.none);
    
    return (
    <section id="createNewChat">
        {chatType === chatTypes.none
        &&  <ul>
                <span className="closeForm" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
                <li><button id="newDirectMessage" onClick={() => setChatType(chatTypes.direct)}><FontAwesomeIcon icon={faPaperPlane}/> New Direct Message</button></li>
                <li><button id="newPrivateChannel" onClick={() => setChatType(chatTypes.private)}><FontAwesomeIcon icon={faLock}/> New private channel</button></li>
                <li><button id="newPublicChannel" onClick={() => setChatType(chatTypes.public)}><FontAwesomeIcon icon={faLockOpen}/> New public channel</button></li>
                <li><button id="newProtectedChannel" onClick={() => setChatType(chatTypes.protected)}><FontAwesomeIcon icon={faKey}/> New protected channel</button></li>
            </ul>}
        {chatType === chatTypes.direct && <DirectMessage onClose={() => setChatType(chatTypes.none)}/>}
        {chatType === chatTypes.private && <PrivateChannel onClose={() => setChatType(chatTypes.none)}/>}
        {chatType === chatTypes.public && <PublicChannel onClose={() => setChatType(chatTypes.none)}/>}
        {chatType === chatTypes.protected && <ProtectedChannel onClose={() => setChatType(chatTypes.none)}/>}
    </section>
    );
}