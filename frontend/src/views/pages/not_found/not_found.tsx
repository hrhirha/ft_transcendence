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
            <h3>This page not found !</h3>
            <NavLink to="/" >Go Home</NavLink>
        </div>
    </main>
    );
}