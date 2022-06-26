import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { CircleAvatar } from "../../../components/circle_avatar/circle_avatar";
import { faCameraRotate, faPen, faPercent, faTableTennisPaddleBall, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { buttons, userType } from "../profile";
import { Numeral } from "../../../components/numeral/numeral";


const StatCard = ({icon, title, stat}: {icon: IconDefinition, title: string, stat: number}) => {
    return <span className="stat">
        <span className="stat_title">
            <FontAwesomeIcon icon={icon}/>
            {title}
        </span>
        <span className="stat_value"><Numeral value={stat}/></span>
    </span>;
}

interface ProfileInfosProps {
    avatar: string;
    username: string;
    fullName: string;
    ranking: number;
    wins: number;
    loses: number;
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
                    <span className="ranking"><Numeral value={Props.ranking}/></span>
                    <span className="editAvatar" title="Change Your Avatar">
                        <FontAwesomeIcon icon={faCameraRotate}/>
                    </span>
                </div>
                <div className="profileMoreData">
                    <input type="text" disabled className="fullName" placeholder="Full Name" onChange={() => {}} value={Props.fullName}/>
                    <span className="userName">@{Props.username}</span>
                    <div className="stats">
                        <StatCard icon={faTableTennisPaddleBall} title="Games" stat={Number(Props.wins + Props.loses)}/>
                        <StatCard icon={faTrophy} title="Wins" stat={Number(Props.wins)}/>
                        <StatCard icon={faPercent} title="Ratio" stat={Number(Number((Props.wins) / (Props.wins + Props.loses) * 100).toFixed(1)) || 0}/>
                    </div>
                </div>
            </div>
            <div className="actionButtons">
                {buttons.map((button) => {
                    if (button.type === userType.none) {
                        return (
                            <button key={`${button.text.replace(' ', '')}`} className={`btn${button.text.replace(' ', '')}`} onClick={() => button.onClick(Props.username)}>
                                <FontAwesomeIcon icon={button.icon} />
                                {button.text}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>
        </section>
    );
}
