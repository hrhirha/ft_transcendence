import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";
import { NotFound404 } from "../../../assets";
import { AuthChecker } from "../../components/check_auth/auth_checker";

export const NotFound:React.FC = () => {
    return (
        <AuthChecker
            redirect="/"
            wrappedContent={
            <main id="notFound">
                <div className='container'>
                    <img alt="Page Not Found" src={NotFound404}/>
                    <h3>There is nothing here !</h3>
                    <NavLink to="/" >
                        <FontAwesomeIcon icon={faHome} />
                        Go Home
                    </NavLink>
                </div>
            </main>}
        />
    );
}