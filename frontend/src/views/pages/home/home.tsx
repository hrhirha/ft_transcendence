import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/card/card";
import { NavBar } from "../../components/navbar/navbar";
import { DefaultGame, UltimateGame } from '../../../assets';

export const Home:React.FC = () => {
    const navigate = useNavigate();
    return (
    <main id="homePage">
        <NavBar />
        <div className='container'>
            <div className='row center' >
            <div className='col col-md-6 col-lg-4'>
                <Card image={DefaultGame} cardTitle='Play default game with your friend' icon="faPuzzlePiece" btnTitle='Play' background='https://i.pinimg.com/originals/d4/1a/3e/d41a3e3cce22dbc082a46c607a013c24.jpg'/>
            </div>
            <div className='col col-md-6 col-lg-4'>
                <Card image={UltimateGame} cardTitle='Play default game with your friend' icon="faPuzzlePiece" btnTitle='Play' background='https://i.pinimg.com/originals/d4/1a/3e/d41a3e3cce22dbc082a46c607a013c24.jpg'/>
            </div>
            </div>
        </div>
    </main>
    );
}