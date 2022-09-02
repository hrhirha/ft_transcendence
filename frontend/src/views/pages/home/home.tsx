import React from "react";
import { useNavigate } from "react-router-dom";
import { CardBg, DefaultGame, LiveGames, UltimateGame } from 'assets';
import { GameCard } from "views/pages/home/game_card/game_card";
import { LiveGamesCard } from "views/pages/home/live_games_card/live_games_card";
import { InvitePlayerForm } from "./invite_player/invite_player";

export const Home:React.FC = () => {
    const navigate = useNavigate();

    return (
        <main id="homePage">
            <div className='container'>
                <div className='row center' >
                    <div className='col col-lg-8'>
                        <InvitePlayerForm callback={() => {}}/>
                    </div>
                </div>
                <div className='row center' >
                    <div className='col col-lg-8'>
                        <LiveGamesCard onClick={() => {navigate('/watch', {replace: true})}} title="Watch Live Matchs" background={LiveGames}/>
                    </div>
                </div>
                <div className='row center' >
                    <div className='col col-md-6 col-lg-4'>
                        <GameCard onClick={() => {navigate('/play/ultimate', {replace: true})}} image={UltimateGame} background={CardBg}/>
                    </div>
                    <div className='col col-md-6 col-lg-4'>
                        <GameCard onClick={() => {navigate('/play', {replace: true})}} image={DefaultGame} background={CardBg}/>
                    </div>
                </div>
            </div>
        </main>
    );
}