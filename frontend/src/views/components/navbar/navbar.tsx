import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faHouse, faRankingStar, faComments, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Brand } from "../brand/brand";
import { NavLink, useLocation } from "react-router-dom";
import { CircleAvatar } from "../circle_avatar/circle_avatar";
import { user_infos } from "../../../controller/user/user";
import { useNotif } from "../notif/notif";
import { logout } from "../../../controller/auth/auth";

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
    const pushNotif = useNotif();


    return (
        <div className="logoutAndProfile">
            <NavLink
                id="profileNavBtn"
                className={location.pathname === "/profile" ? "active" : undefined}
                title="Profile" to="/profile">
                    <CircleAvatar avatarURL={picture} dimensions={45} showStatus={false}/>
            </NavLink>
            <FontAwesomeIcon onClick={() => {
                pushNotif({
                    type: "info",
                    icon: <FontAwesomeIcon icon={faPowerOff}/>,
                    title: "Are you leaving?",
                    description:"Are you sure want to logout ?",
                    actions: [{title: "Logout now", color: "#6970d4", action: async () => {
                        await logout();
                        document.location = "/";
                    }}] 
                });
            }} icon={faPowerOff} title="logout" className="logout"/>
        </div>
    );
}

const Menu:React.FC<{user: user_infos}> = ({user}) => {
    return (
        <ul id="navMenu">
            {MenuData.map((e, i) => <li key={i}><NavButton element={e}/></li>)}
            <li>
                <ProfileNavBtn picture={user.imageUrl}/>
            </li>
        </ul>
    );
}

export const NavBar:React.FC<{user: user_infos}> = ({user}) => {
    return (
        <header id="navbar" className="container-fluid">
            <div className="container">
                <div className="row">
                    <span id="brand" className='col col-md-3'>
                        <NavLink to="/" >
                            <Brand/>
                        </NavLink>
                    </span>
                    <nav id="Menu" className='col'>
                        <Menu user={user}/>
                    </nav>
                </div>
            </div>
        </header>
    );
}