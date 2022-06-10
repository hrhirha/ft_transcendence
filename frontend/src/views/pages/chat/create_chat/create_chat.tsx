import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose, faKey, faLock, faLockOpen} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { UserSearchForm } from "../../../components/user_search/user_search";
import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";

enum chatTypes {
    public, private, protected, none
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

const PrivateChat:React.FC<{onClose: Function}> = ({onClose}) => {
    const [userSelected, setUserSelected] = useState<any>(null);
    return (
    <form id="newPrivateChat" className="creatChatForm">
        <span className="closeForm" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
        <h5><FontAwesomeIcon icon={faLock}/>Private Chat</h5>
        {userSelected === null && <UserSearchForm callback={(selectedUser: any) => setUserSelected(selectedUser)}/>}
        {userSelected !== null
            && <UserCheckedCard
                onRemove={() => setUserSelected(null)}
                avatar={userSelected.avatar}
                fullName={userSelected.fullName}
            />}
        {userSelected !== null
            && <button id="submitChat" onClick={() => {}}>
                <FontAwesomeIcon icon={faCheck}/>
                Submit
            </button>}
    </form>
    );
}

const PublicChat:React.FC<{onClose: Function}> = ({onClose}) => {
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    return (
    <form id="newPublicChat" className="creatChatForm">
        <span className="closeForm" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
        <h5><FontAwesomeIcon icon={faLockOpen}/>Public Group</h5>
        <input id="chatTitle" className="textInput" type="text" placeholder="group title" autoComplete="off"/>
        <UserSearchForm callback={(userSelected: any) => {
            console.log(selectedUsers);
            if (selectedUsers.length === 0 || !selectedUsers.find(user => user.id === userSelected.id)) {
                setSelectedUsers(prvUsers => [...prvUsers, userSelected]);
            }
        }}/>
        <div className="usersAdded">
            {selectedUsers.length > 0 && selectedUsers.map((user: any, k: number) => <UserCheckedCard
                key={k}
                onRemove={() => setSelectedUsers(prvResults => prvResults.filter((u: any) => u.id !== user.id))}
                avatar={user.avatar}
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

const ProtectedChat:React.FC<{onClose: Function}> = ({onClose}) => {
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    return (
    <form id="newProtectedChat" className="creatChatForm">
        <span className="closeForm" onClick={() => onClose()}><FontAwesomeIcon icon={faClose}/></span>
        <h5><FontAwesomeIcon icon={faKey}/>Protected Group</h5>
        <input id="chatTitle" className="textInput" type="text" placeholder="group title" autoComplete="off"/>
        <input id="chatKey" className="textInput" type="password" placeholder="password" autoComplete="off"/>
        <UserSearchForm callback={(userSelected: any) => {
            console.log(selectedUsers);
            if (selectedUsers.length === 0 || !selectedUsers.find(user => user.id === userSelected.id)) {
                setSelectedUsers(prvUsers => [...prvUsers, userSelected]);
            }
        }}/>
        <div className="usersAdded">
            {selectedUsers.length > 0 && selectedUsers.map((user: any, k: number) => <UserCheckedCard
                key={k}
                onRemove={() => setSelectedUsers(prvResults => prvResults.filter((u: any) => u.id !== user.id))}
                avatar={user.avatar}
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
                <li><button id="newPrivateChat" onClick={() => setChatType(chatTypes.private)}><FontAwesomeIcon icon={faLock}/> New private chat</button></li>
                <li><button id="newPublicChat" onClick={() => setChatType(chatTypes.public)}><FontAwesomeIcon icon={faLockOpen}/> New public group</button></li>
                <li><button id="newProtectedChat" onClick={() => setChatType(chatTypes.protected)}><FontAwesomeIcon icon={faKey}/> New protected group</button></li>
            </ul>}
        {chatType === chatTypes.private && <PrivateChat onClose={() => setChatType(chatTypes.none)}/>}
        {chatType === chatTypes.public && <PublicChat onClose={() => setChatType(chatTypes.none)}/>}
        {chatType === chatTypes.protected && <ProtectedChat onClose={() => setChatType(chatTypes.none)}/>}
    </section>
    );
}