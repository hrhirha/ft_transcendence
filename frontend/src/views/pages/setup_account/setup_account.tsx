import React, { useEffect, useState } from "react";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { User, userDefault } from "controller/user/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCameraRotate, faClose, faTrash, faUserCheck, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { setupAccount } from "controller/user/edit";
import { useNotif } from "views/components/notif/notif";
import { history } from "index";

export const SetupAccount:React.FC = () =>  {
    const [userInfos, setUserInfos] = useState<User>(userDefault);
    const [userAvatar, setUserAvatar] = useState<any>(null);
    const [fullName, setFullName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>(userInfos?.imageUrl);
    const pushNotif = useNotif();

    const submitData = async (e) => {
        e.preventDefault();
        try {
            if (!/^([a-zA-Z]+-?[a-zA-Z]+)( ([a-zA-Z]+(-[a-zA-Z]+)*\.?))+$/.test(fullName!) || fullName!.length > 40)
                throw(Error("Full Name can only contain a-z SP A-Z - . and max length 40"));
            if (/[\w]{4,20}$/.test(username!) === false)
                throw(Error("Userame can only contain a-z and max length 20"));
            await setupAccount(userAvatar, fullName, username);
            history.replace("/");
        } catch(e: any) {
            pushNotif({
                id: "UPDATEPROFILEERROR",
                type: "error",
                icon: <FontAwesomeIcon icon={faClose}/>,
                title: "ERROR",
                description: e.message
            });
        }
    }

    const updateAvatar = () => {
        var f = document.createElement('input');
        f.style.display='none';
        f.type='file';
        f.name='file';
        f.accept='.jpg,.jpeg,.png,.gif';
        f.addEventListener("change", (e : any) => {
            const [file] = e.target.files;
            setUserAvatar(file);
            setAvatarUrl(URL.createObjectURL(file));
        });
        f.click();
    }

    const urlToFile = async (image: string) => {
        const response = await fetch(image);
        const blob = await response.blob();
        return (new File([blob], 'image.jpg', {type: blob.type}))
    }

    const genereateUsername = (fullName: string) => {
        const firstName = fullName.toLowerCase().substring(0, fullName.indexOf(' '));
        const lastName = fullName.toLowerCase().substring(fullName.indexOf(' ') + 1).replace(/ /g, "-")
        return (`${firstName[0]}${lastName}`).substring(0, 8);
    }
    useEffect(() => {
        setUsername(genereateUsername("Full Name Here"));
        
        // (async () => {
        //     const file = await urlToFile("https://static.saltinourhair.com/wp-content/uploads/2017/04/23115137/most-beautiful-riad-marrakech-morocco.jpg");
        //     setUserAvatar(file);
        //     setAvatarUrl(URL.createObjectURL(file));
        // })();
    }, []);

    return (
        <main id="setupAccount">
            <form className="setupAccount" onSubmit={submitData}>
                <div className="sectionTitle">
                    <FontAwesomeIcon icon={faUserPen}/>
                    <h2><b>Setup</b> Account</h2>
                </div>
                <div className="avatar">
                    <CircleAvatar avatarURL={avatarUrl} dimensions={120} status={null}/>
                    <span onClick={() => {setUserAvatar(null); setAvatarUrl("")}} className={`option ${avatarUrl === "" ? "disabled" : ""}`} id="removeAvatar" title="Remove Avatar"><FontAwesomeIcon icon={faTrash}/></span>
                    <span onClick={() => updateAvatar()}className="option" id="updateAvatar" title="Update Avatar"><FontAwesomeIcon icon={faCameraRotate}/></span>
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