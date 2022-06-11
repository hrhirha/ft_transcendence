import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";
import { faPen, faPercent, faTableTennisPaddleBall, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { buttons, userType } from "../profile";


const StatCard = ({icon, title, stat}: {icon: IconDefinition, title: string, stat: number}) => {
    return <span className="stat">
        <span className="stat_title">
            <FontAwesomeIcon icon={icon}/>
            {title}
        </span>
        <span className="stat_value">{stat}</span>
    </span>;
}

interface ProfileInfosProps {
    avatar: string;
    username: string;
    fullName: string;
    ranking: number;
    wins: number;
}

export const ProfileInfos:React.FC<ProfileInfosProps> = (Props) => {
    
    return (
        <section id="profileInfos">
            <button className="edit" title="Edit Profile">
                <FontAwesomeIcon icon={faPen}/>
            </button>
            <div className="profileData">
                <div className="avatar">
                    <CircleAvatar avatarURL={Props.avatar} dimensions={120} showStatus={false}/>
                    <span className="ranking">{Props.ranking}</span>
                    {/* <span className="editAvatar" title="Change Your Avatar">
                        <FontAwesomeIcon icon={faCameraRotate}/>
                    </span> */}
                </div>
                <div className="profileMoreData">
                    <input type="text" disabled className="fullName" placeholder="Full Name" onChange={() => {}} value={Props.fullName}/>
                    <span className="userName">@{Props.username}</span>
                    <div className="stats">
                        <StatCard icon={faTableTennisPaddleBall} title="Games" stat={32}/>
                        <StatCard icon={faTrophy} title="Wins" stat={7}/>
                        <StatCard icon={faPercent} title="Ratio" stat={21.8}/>
                    </div>
                </div>
            </div>
            <div className="actionButtons">
                {buttons.map((button, index) => {
                    if (button.type === userType.none) {
                        return (
                            <button key={index} className={`btn${button.text}`} onClick={() => button.onClick(Props.username)}>
                                <FontAwesomeIcon icon={button.icon} />
                                {button.text}
                            </button>
                        );
                    }
                    return (<></>);
                })}
            </div>
        </section>
    );
}
