import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NotFound404 } from "../../../assets";
import { NavBar } from "../../components/navbar/navbar";

export const NotFound:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="notFound">
        <NavBar />
        <div className='container'>
            <img src={NotFound404}/>
            <h3>There is nothing here !</h3>
            <NavLink to="/" >
                <FontAwesomeIcon icon={faHome} />
                Go Home
            </NavLink>
        </div>
    </main>
    );
}