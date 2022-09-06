import React from "react";
import { useNavigate } from "react-router-dom";
import { CardBg, DefaultGame, LiveGames, UltimateGame } from 'assets';
import { GameCard } from "views/pages/home/game_card/game_card";
import { LiveGamesCard } from "views/pages/home/live_games_card/live_games_card";
import { InvitePlayerForm } from "./invite_player/invite_player";
import { history } from "index";

export const Home:React.FC = () => {

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
                        <LiveGamesCard onClick={() => {history.push('/watch')}} title="Watch Live Matchs" background={LiveGames}/>
                    </div>
                </div>
                <div className='row center' >
                    <div className='col col-md-6 col-lg-4'>
                        <GameCard onClick={() => {history.push('/play/ultimate')}} image={UltimateGame} background={CardBg}/>
                    </div>
                    <div className='col col-md-6 col-lg-4'>
                        <GameCard onClick={() => {history.push('/play')}} image={DefaultGame} background={CardBg}/>
                    </div>
                </div>
            </div>
        </main>
    );
}