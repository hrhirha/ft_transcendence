import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faHouse, faRankingStar, faComments, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { Brand } from "views/components/brand/brand";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CircleAvatar } from "views/components/circle_avatar/circle_avatar";
import { User } from "controller/user/user";
import { useNotif } from "views/components/notif/notif";
import { logout } from "controller/auth/auth";
import { SocketContext } from "index";

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
        <Link to={element.url} id="navBtn" className={location.pathname === element.url ? "active" : undefined} title={element.title} >
            <FontAwesomeIcon icon={element.icon}/>
            <h3>{element.title}</h3>
        </Link>
    );
}

const ProfileNavBtn:React.FC<{picture: string}> = ({picture}) => {
    const location = useLocation();
    const pushNotif = useNotif();
    const class_socket = useContext(SocketContext);

    return (
        <div className="logoutAndProfile">
            <Link
                id="profileNavBtn"
                className={location.pathname === "/profile" ? "active" : undefined}
                title="Profile" to="/profile">
                    <CircleAvatar avatarURL={picture} dimensions={45} status = {null}/>
            </Link>
            <FontAwesomeIcon onClick={() => {
                pushNotif({
                    id: "LOGOUTCONFIRMATION",
                    type: "info",
                    icon: <FontAwesomeIcon icon={faPowerOff}/>,
                    title: "Are you leaving?",
                    description:"Are you sure want to logout ?",
                    actions: [{title: "Logout now", color: "#6970d4", action: async () => {
                        await logout();
                        class_socket.socket.disconnect();
                        document.location = "/";
                    }}] 
                });
            }} icon={faPowerOff} title="logout" className="logout"/>
        </div>
    );
}

const Menu:React.FC<{user: User}> = ({user}) => {
    return (
        <ul id="navMenu">
            {MenuData.map((e, i) => <li key={i}><NavButton element={e}/></li>)}
            <li>
                <ProfileNavBtn picture={user.imageUrl}/>
            </li>
        </ul>
    );
}

export const NavBar:React.FC = () => {
    const [user] = useState(JSON.parse(window.localStorage.getItem("user")));
    return (
        <header id="navbar" className="container-fluid">
            <div className="container">
                <div className="row">
                    <span id="brand" className='col col-md-3'>
                        <Link to="/" >
                            <Brand/>
                        </Link>
                    </span>
                    <nav id="Menu" className='col'>
                        <Menu user={user}/>
                    </nav>
                </div>
            </div>
        </header>
    );
}