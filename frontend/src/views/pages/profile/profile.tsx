import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/navbar/navbar";

export const Profile:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="profilePage">
        <NavBar />
        <div className='container'>
            
        </div>
    </main>
    );
}