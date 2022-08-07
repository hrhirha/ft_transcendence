import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { faCameraRotate, faCheck, faClose, faPen, faPercent, faTableTennisPaddleBall, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { buttons, userType } from "views/pages/profile/profile";
import { Numeral } from "views/components/numeral/numeral";
import { patch_avatar_upload, patch_edit_fullname } from "controller/user/edit";
import { useEffect, useState } from "react";
import { get_me, get_user_by_username, userDefault, User } from "controller/user/user";
import { useNotif } from "views/components/notif/notif";
import { TwoFAButton, TwoFACard } from "views/components/twofa_card/twofa";
import { disableTFA, enableTFA } from "controller/auth/auth";
import { useNavigate, useParams } from "react-router-dom";


const StatCard = ({icon, title, stat}: {icon: IconDefinition, title: string, stat: number}) => {
    return <span className="stat">
        <span className="stat_title">
            <FontAwesomeIcon icon={icon}/>
            {title}
        </span>
        <span className="stat_value"><Numeral value={stat}/></span>
    </span>;
}

export const ProfileInfos:React.FC<{userProfile: boolean}> = ({userProfile}) => {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [userInfos, setUserInfos] = useState<User>(userDefault);
    const [fullName, setFullName] = useState<string>();
    const [userImage, setUserImage] = useState<any>();
    const [enable2fa, setEnable2fa] = useState<boolean>(false);
    const [detectUpdates, setUpdates] = useState<{avatar: boolean, name: boolean}>({avatar: false, name: false});
    const pushNotif = useNotif();
    const username = useParams();
    const navigate = useNavigate();


    const updateAvatar = () => {
        var f = document.createElement('input');
        f.style.display='none';
        f.type='file';
        f.name='file';
        f.accept='.jpg,.jpeg,.png,.gif';
        f.addEventListener("change", async (e : any) => {
            const [file] = e.target.files;
            setUserImage(file);
            setUpdates({avatar: true, name: detectUpdates.name});
        });
        f.click();
    }


    const editProfile = async ()  => {
        try {
            console.log(detectUpdates)
            if (detectUpdates.name && !/^([a-zA-Z]+-?[a-zA-Z]+)( ([a-zA-Z]+(\-[a-zA-Z]+)*\.?))+$/.test(fullName!) || fullName!.length > 40)
                throw({message: "Full Name can only contain a-z SP A-Z - . and max length 40"});
            if (detectUpdates.name)
                await patch_edit_fullname(fullName!);
            if (detectUpdates.avatar)
                await patch_avatar_upload(userImage);
            if (detectUpdates.avatar || detectUpdates.name)
            {
                await getUserData();
                pushNotif({
                    id: "UPDATEPROFILESUCCESS",
                    type: "success",
                    icon: <FontAwesomeIcon icon={faCheck}/>,
                    title: "Success",
                    description: "Profile updated successfully!"
                });
                setUpdates({avatar: false, name: false});
            }
        }
        catch(e: any) {
            setEditMode(oldMode => !oldMode);
            pushNotif({
                id: "UPDATEPROFILEERROR",
                type: "error",
                icon: <FontAwesomeIcon icon={faClose}/>,
                title: "ERROR",
                description: e.message
            });
        }
    }

    const switchTwoFA = async (code: string) => {
        try {
            let _enabled2fa :boolean = true;
            if (/^[0-9]{6}$/.test(code))
            {
                if (userInfos.isTfaEnabled)
                {
                    await disableTFA(code);
                    _enabled2fa = false;
                }
                if (!userInfos.isTfaEnabled)
                    await enableTFA(code);
                await getUserData();
                setEnable2fa(false);
                pushNotif({
                    id: "2FAMETHODESUCCESS",
                    type: "success",
                    icon: <FontAwesomeIcon icon={faCheck}/>,
                    title: "SUCCESS",
                    description: `2FA methode ${_enabled2fa ? "ENABLED" : "DISABLED"} successfully`
                });
            }
            else 
                throw({message: "CODE must be 6 digits"});
        } catch (err: any) {
            pushNotif({
                id: "2FAMETHODEERROR",
                type: "error",
                icon: <FontAwesomeIcon icon={faClose}/>,
                title: "ERROR",
                description: err.message
            });
        }
    }



    const getUserData = async () => {
        try {
            if (userProfile)
            {
                const me: User = await get_me();
                setUserInfos(me);
                setFullName(me.fullName);
            }
            else 
            {
                try {
                    const user: User = await get_user_by_username(username.username!);
                    setUserInfos(user);
                    setFullName(user.fullName);
                    if (user.relation === null)
                        navigate("/profile");
                    console.log(user.relation);
                    if (user.relation === "blocked")
                        navigate("/notfound");
                }
                catch(e) {
                    navigate("/notfound");
                }
            }
        } catch (err: any) {
            pushNotif({
                id: "GETUSERDATAERROR",
                type: "error",
                icon: <FontAwesomeIcon icon={faClose}/>,
                title: "ERROR",
                description: err.message
            });
        }
    };

    useEffect(() => {
        getUserData();
    },[userProfile]);

    return (
        <section id="profileInfos">
            {userProfile && <button className={editMode ? "save" : "edit"} title="Edit Profile" onClick={() => {
                setEditMode(oldMode => !oldMode);
                if (editMode)
                    editProfile();
            }}>
                <FontAwesomeIcon icon={editMode ? faCheck : faPen}/>
            </button>}
            <div className="profileData">
                <div className="avatar">
                    <CircleAvatar avatarURL={userImage && URL.createObjectURL(userImage) || userInfos?.imageUrl} dimensions={120} showStatus={false}/>
                    <span className="achievement"><img src={userInfos.rank.icon} title={userInfos.rank.title} alt="achievement" /></span>
                    {editMode && <span className="editAvatar" title="Change Your Avatar" onClick={updateAvatar}>
                        <FontAwesomeIcon icon={faCameraRotate}/>
                    </span>}
                </div>
                <div className="profileMoreData">
                    {fullName && <input type="text" disabled={!editMode} className="fullName" placeholder="Full Name" onChange={(e) => {
                        setFullName(e.target.value);
                        setUpdates({name: true, avatar: detectUpdates.avatar});
                    }} value={fullName}/>}
                    <span className="userName">@{userInfos?.username}</span>
                    <div className="stats">
                        <StatCard icon={faTableTennisPaddleBall} title="Games" stat={Number(userInfos?.wins + userInfos?.loses)}/>
                        <StatCard icon={faTrophy} title="Wins" stat={Number(userInfos?.wins)}/>
                        <StatCard icon={faPercent} title="Ratio" stat={Number(Number((userInfos?.wins) / (userInfos?.wins + userInfos?.loses) * 100).toFixed(1)) || 0}/>
                    </div>
                </div>
            </div>
            {!userProfile && <div className="actionButtons">
                {buttons.map((button) => {
                    if (userType[button.type] === userInfos?.relation) {
                        return (
                            <button key={`${button.text.replace(' ', '')}`} className={`btn${button.text.replace(' ', '')}`} onClick={async () => {
                                try {
                                    await button.onClick(userInfos?.id);
                                    await getUserData();
                                }
                                catch(e: any) {
                                    pushNotif({
                                        id: "BUTTONACTIONERROR",
                                        type: "error",
                                        icon: <FontAwesomeIcon icon={faClose}/>,
                                        title: "ERROR",
                                        description: e.message
                                    });
                                }
                            }}>
                                <FontAwesomeIcon icon={button.icon} />
                                {button.text}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>}
            {userProfile && <TwoFAButton onClick={() => setEnable2fa(true)} enabled={userInfos?.isTfaEnabled!}/>}
            {userProfile && enable2fa && <TwoFACard enabled={userInfos?.isTfaEnabled!} onSubmit={(code: string) => switchTwoFA(code)} onClose={() => setEnable2fa(false)}/>}
        </section>
    );
}

