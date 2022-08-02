import React from "react";
import { useNavigate } from "react-router-dom";
import { DefaultGame, LiveGames, UltimateGame } from 'assets';
import { GameCard } from "views/pages/home/game_card/game_card";
import { LiveGamesCard } from "views/pages/home/live_games_card/live_games_card";

export const Home:React.FC = () => {
    const navigate = useNavigate();

    return (
        <main id="homePage">
            <div className='container'>
                <div className='row center' >
                    <div className='col col-lg-8'>
                        <LiveGamesCard onClick={() => {navigate('/watch', {replace: true})}} title="Watch Live games" background={LiveGames}/>
                    </div>
                </div>
                <div className='row center' >
                    <div className='col col-md-6 col-lg-4'>
                        <GameCard onClick={() => {navigate('/play/ultimate', {replace: true})}} image={UltimateGame} background='https://i.pinimg.com/originals/d4/1a/3e/d41a3e3cce22dbc082a46c607a013c24.jpg'/>
                    </div>
                    <div className='col col-md-6 col-lg-4'>
                        <GameCard onClick={() => {navigate('/play', {replace: true})}} image={DefaultGame} background='https://i.pinimg.com/originals/d4/1a/3e/d41a3e3cce22dbc082a46c607a013c24.jpg'/>
                    </div>
                </div>
            </div>
        </main>
    );
}