import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faHouse, faRankingStar, faComments } from "@fortawesome/free-solid-svg-icons";
import { Brand } from "../brand/brand";
import { NavLink, useLocation } from "react-router-dom";
import { CircleAvatar } from "../circle_avatar/circle_avatar";

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
    }
];

const NavButton:React.FC<{element: NavButtonData}> = ({element}) => {
    const location = useLocation();

    return (
        <NavLink to={element.url} id="navBtn" className={location.pathname === element.url ? "active" : undefined} title={element.title} >
            <FontAwesomeIcon icon={element.icon}/>
            <h3>{element.title}</h3>
        </NavLink>
    );
}

const ProfileNavBtn:React.FC<{picture: string}> = ({picture}) => {
    const location = useLocation();

    return (
        <NavLink
            id="profileNavBtn"
            className={location.pathname === "/profile" ? "active" : undefined}
            title="Profile" to="/profile">
                <CircleAvatar avatarURL={picture} dimensions={45} showStatus={true}/>
        </NavLink>
    );
}

const Menu:React.FC = () => {
    return (
        <ul id="navMenu">
            {MenuData.map((e, i) => <li key={i}><NavButton element={e}/></li>)}
            <li>
                <ProfileNavBtn picture="https://i.pravatar.cc/500"/>
            </li>
        </ul>
    );
}

export const NavBar:React.FC = () => {
    return (
        <header id="navbar" className="container-fluid">
            <div className="container">
                <div className="row">
                    <span id="brand" className='col col-md-3'>
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