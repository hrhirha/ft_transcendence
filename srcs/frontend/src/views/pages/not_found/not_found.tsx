import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import { NotFound404 } from "assets";

export const NotFound:React.FC = () => {
    return (
        <main id="notFound">
            <div className='container'>
                <img alt="Page Not Found" src={NotFound404}/>
                <h3>Nothing here !</h3>
                <NavLink to="/" >
                    <FontAwesomeIcon icon={faHome} />
                    Go Home
                </NavLink>
            </div>
        </main>
    );
}