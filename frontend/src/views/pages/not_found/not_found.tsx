import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import { NotFound404 } from "../../../assets";
import { NavBar } from "../../components/navbar/navbar";

export const NotFound:React.FC = () => {
    return (
    <main id="notFound">
        <NavBar />
        <div className='container'>
            <img alt="Page Not Found" src={NotFound404}/>
            <h3>There is nothing here !</h3>
            <NavLink to="/" >
                <FontAwesomeIcon icon={faHome} />
                Go Home
            </NavLink>
        </div>
    </main>
    );
}