import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";
import { faCameraRotate, faCheck, faClose, faPen, faPercent, faTableTennisPaddleBall, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { buttons, userType } from "../profile";
import { Numeral } from "../../../components/numeral/numeral";
import { patch_avatar_upload, patch_edit_fullname } from "../../../../controller/user/edit";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { get_me, me_info } from "../../../../controller/user/user";
import { useNotif } from "../../../components/notif/notif";
import { TwoFAButton, TwoFACard } from "../../../components/twofa_card/twofa";
import { disableTFA, enableTFA } from "../../../../controller/2fa/2fa";


const StatCard = ({icon, title, stat}: {icon: IconDefinition, title: string, stat: number}) => {
    return <span className="stat">
        <span className="stat_title">
            <FontAwesomeIcon icon={icon}/>
            {title}
        </span>
        <span className="stat_value"><Numeral value={stat}/></span>
    </span>;
}

const defaultValues = {
    id: "",
    username: "",
    email: "",
    fullName: "",
    profileUrl: "",
    imageUrl: "",
    isTfaEnabled: false,
    score: 0,
    rank: 0,
    status: "",
    wins: 0,
    loses: 0
};

export const ProfileInfos:React.FC = () => {
    const navigate = useNavigate();
    const pushNotif = useNotif();
    const [editMode, setEditMode] = useState<boolean>(false);
    const [userInfos, setUserInfos] = useState<me_info>(defaultValues);
    const [fullName, setFullName] = useState<string>();
    const [userImage, setUserImage] = useState<any>();
    const [enable2fa, setEnable2fa] = useState<boolean>(false);

    const updateAvatar = () => {
        var f = document.createElement('input');
        f.style.display='none';
        f.type='file';
        f.name='file';
        f.accept='.jpg,.jpeg,.png,.gif';
        f.addEventListener("change", async (e : any) => {
            const [file] = e.target.files;
            setUserImage(file);
        });
        f.click();
    }


    const editProfile = async ()  => {
        try {
            if (!/^([a-zA-Z]+-?[a-zA-Z]+)( ([a-zA-Z]+(\-[a-zA-Z]+)*\.?))+$/.test(fullName!) || fullName!.length > 40)
                throw({message: "Full Name can only contain a-z SP A-Z - . and max length 40"});
            await patch_edit_fullname(fullName!);
            await patch_avatar_upload(userImage);
            await getUserData();
            pushNotif({
                type: "success",
                icon: <FontAwesomeIcon icon={faCheck}/>,
                title: "Success",
                description: "Profile updated successfully!"
            });
        }
        catch(e: any) {
            setEditMode(oldMode => !oldMode);
            pushNotif({
                type: "error",
                icon: <FontAwesomeIcon icon={faClose}/>,
                title: "ERROR",
                description: e.message
            });
        }
    }

    const switchTwoFA = async (code: string) => {
        try {
            if (userInfos.isTfaEnabled)
                await disableTFA();
            if (!userInfos.isTfaEnabled)
                await enableTFA(code);
            // setUserInfos(oldUser => oldUser.isTfaEnabled = true;);
            setEnable2fa(false);
        } catch (err: any) {
            pushNotif({
                type: "error",
                icon: <FontAwesomeIcon icon={faClose}/>,
                title: "ERROR",
                description: err.message
            });
        }
    }

    const getUserData = async () => {
        try {
            const me: me_info = await get_me();
            setUserInfos(me);
            setFullName(me.fullName);
        } catch (err: any) {
            pushNotif({
                type: "error",
                icon: <FontAwesomeIcon icon={faClose}/>,
                title: "ERROR",
                description: err.message
            });
        }
    };

    useEffect(() => {
        getUserData();
    },[]);

    return (
        <section id="profileInfos">
            <button className={editMode ? "save" : "edit"} title="Edit Profile" onClick={() => {
                setEditMode(oldMode => !oldMode);
                if (editMode)
                    editProfile();
            }}>
                <FontAwesomeIcon icon={editMode ? faCheck : faPen}/>
            </button>
            <div className="profileData">
                <div className="avatar">
                    <CircleAvatar avatarURL={userImage && URL.createObjectURL(userImage) || userInfos?.imageUrl} dimensions={120} showStatus={false}/>
                    <span className="score"><Numeral value={userInfos?.score}/></span>
                    {editMode && <span className="editAvatar" title="Change Your Avatar" onClick={updateAvatar}>
                        <FontAwesomeIcon icon={faCameraRotate}/>
                    </span>}
                </div>
                <div className="profileMoreData">
                    <input type="text" disabled={!editMode} className="fullName" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} value={fullName}/>
                    <span className="userName">@{userInfos?.username}</span>
                    <div className="stats">
                        <StatCard icon={faTableTennisPaddleBall} title="Games" stat={Number(userInfos?.wins + userInfos?.loses)}/>
                        <StatCard icon={faTrophy} title="Wins" stat={Number(userInfos?.wins)}/>
                        <StatCard icon={faPercent} title="Ratio" stat={Number(Number((userInfos?.wins) / (userInfos?.wins + userInfos?.loses) * 100).toFixed(1)) || 0}/>
                    </div>
                </div>
            </div>
            {!editMode && <div className="actionButtons">
                {buttons.map((button) => {
                    if (button.type === userType.none) {
                        return (
                            <button key={`${button.text.replace(' ', '')}`} className={`btn${button.text.replace(' ', '')}`} onClick={() => button.onClick(userInfos?.id)}>
                                <FontAwesomeIcon icon={button.icon} />
                                {button.text}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>}
            {editMode && <TwoFAButton onClick={() => setEnable2fa(true)} enabled={userInfos?.isTfaEnabled}/>}
            {enable2fa && <TwoFACard enabled={userInfos?.isTfaEnabled} onSubmit={(code: string) => switchTwoFA(code)} onClose={() => setEnable2fa(false)}/>}
        </section>
    );
}

