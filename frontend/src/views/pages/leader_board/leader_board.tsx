import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/navbar/navbar";

export const LeaderBoard:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="leaderBoardPage">
        <NavBar />
        <div className='container'>
            
        </div>
    </main>
    );
}