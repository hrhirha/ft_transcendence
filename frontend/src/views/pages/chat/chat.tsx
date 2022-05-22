import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/navbar/navbar";

export const Chat:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="chatPage">
        <NavBar />
        <div className='container'>
            
        </div>
    </main>
    );
}