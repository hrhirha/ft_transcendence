import React from "react";
import { DefaultGame, LiveGames, UltimateGame } from '../../../assets';
import { GameCard } from "./game_card/game_card";
import { LiveGamesCard } from "./live_games_card/live_games_card";
import { AuthChecker } from "../../components/check_auth/auth_checker";

export const Home:React.FC = () => {
    return (
    <AuthChecker
     redirect="/"
     wrappedContent={
        <main id="homePage">
            <div className='container'>
                <div className='row center' >
                    <div className='col col-lg-8'>
                        <LiveGamesCard title="Watch Live games" background={LiveGames}/>
                    </div>
                </div>
                <div className='row center' >
                    <div className='col col-md-6 col-lg-4'>
                        <GameCard image={UltimateGame} background='https://i.pinimg.com/originals/d4/1a/3e/d41a3e3cce22dbc082a46c607a013c24.jpg'/>
                    </div>
                    <div className='col col-md-6 col-lg-4'>
                        <GameCard image={DefaultGame} background='https://i.pinimg.com/originals/d4/1a/3e/d41a3e3cce22dbc082a46c607a013c24.jpg'/>
                    </div>
                </div>
            </div>
        </main>}
    />
    );
}