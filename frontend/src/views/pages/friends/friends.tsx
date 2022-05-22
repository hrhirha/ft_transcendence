import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/navbar/navbar";

export const Friends:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="friendsPage">
        <NavBar />
        <div className='container'>
            
        </div>
    </main>
    );
}