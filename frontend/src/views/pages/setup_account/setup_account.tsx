import React, { useState } from "react";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { User, userDefault } from "controller/user/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRotate, faCheck, faTrash, faUserCheck, faUserGear, faUserPen } from "@fortawesome/free-solid-svg-icons";

export const SetupAccount:React.FC = () =>  {
    const [userInfos, setUserInfos] = useState<User>(userDefault);
    const [userAvatar, setUserAvatar] = useState<any>();
    const [fullName, setFullName] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const submitData = () => {
        console.log("submit data");
    }

    return (
        <main id="setupAccount">
            <form className="setupAccount" onSubmit={() => submitData()}>
                <div className="sectionTitle">
                    <FontAwesomeIcon icon={faUserPen}/>
                    <h2><b>Setup</b> Account</h2>
                </div>
                <div className="avatar">
                    <CircleAvatar avatarURL={(userAvatar && URL.createObjectURL(userAvatar)) || userInfos?.imageUrl} dimensions={120} status={null}/>
                    <span className="option" id="removeAvatar" title="Remove Avatar"><FontAwesomeIcon icon={faTrash}/></span>
                    <span className="option" id="updateAvatar" title="Update Avatar"><FontAwesomeIcon icon={faCameraRotate}/></span>
                </div>
                <input type="text" className="fullName" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} value={fullName}/>
                <input type="text" className="username" placeholder="username" onChange={(e) => setUsername(e.target.value)} value={username}/>
                <button type="submit">
                    <FontAwesomeIcon icon={faUserCheck}/>
                    Submit
                </button>
            </form>
        </main>
    );
}