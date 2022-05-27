import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faHouse, faRankingStar, faComments, faUserGroup} from "@fortawesome/free-solid-svg-icons";
import { Brand } from "../brand/brand";
import { useLocation } from "react-router-dom";

interface NavButtonData {
    icon: IconDefinition,
    title: string,
    url: string
}

const MenuData: Array<NavButtonData> = [
    {
        icon: faHouse,
        title: "Home",
        url: "/"
    },
    {
        icon: faRankingStar,
        title: "Leader board",
        url: "/leader_board"
    },
    {
        icon: faComments,
        title: "Chat",
        url: "/chat"
    },
    {
        icon: faUserGroup,
        title: "Friends",
        url: "/friends"
    }
];

const NavButton:React.FC<{element: NavButtonData}> = ({element}) => {
    const location = useLocation();

    return (
        <a id="navBtn" className={location.pathname === element.url ? "active" : undefined} title={element.title} href={element.url}>
            <FontAwesomeIcon icon={element.icon}/>
        </a>
    );
}

const ProfileNavBtn:React.FC<{picture: string}> = ({picture}) => {
    const location = useLocation();

    return (
        <a id="profileNavBtn" className={location.pathname === "/profile" ? "active" : undefined} title="Profile" href="/profile" style={{backgroundImage: `url(${picture})`}}></a>
    );
}

const Menu:React.FC = () => {
    return (
        <ul id="navMenu">
            {MenuData.map((e, i) => <li key={i}><NavButton element={e}/></li>)}
            <li>
                <ProfileNavBtn picture="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"/>
            </li>
        </ul>
    );
}

export const NavBar:React.FC = () => {
    return (
        <header id="navbar" className="container-fluid">
            <div className="container">
                <div className="row">
                    <span id="brand" className='col'>
                        <a href="/" >
                            <Brand/>
                        </a>
                    </span>
                    <nav id="Menu" className='col'>
                        <Menu/>
                    </nav>
                </div>
            </div>
        </header>
    );
}