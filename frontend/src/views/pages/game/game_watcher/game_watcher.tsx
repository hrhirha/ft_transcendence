import { WatchEmptyState } from "assets";
import { get_ongoing_matchs, Match } from "controller/user/matchs";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { GameView } from "views/pages/game/game_view/game_view";

export const GameWatcher:React.FC = () =>  {
    const socket = io("ws://127.0.0.1:3001/game", {withCredentials: true});
    const [ongoingMatchs, setMatchs] = useState<Array<Match>>([]);

    useEffect(() => {
        (async () => {
            try {
                const _matchs: Array<Match> = await get_ongoing_matchs();
                setMatchs(_matchs);
            } catch(e: any) {}
        })();
    },[]);

    return (
        <section id="gameWatcher" className="container">
            <div className="row">
                <div className="col-10 col-md-8 col-lg-6">
                    {ongoingMatchs.length === 0 && <img className="noLiveGames" src={WatchEmptyState}/>}
                    {ongoingMatchs.length > 0 && <GameView gameSocket={socket} isUltimate={false} watcher={true} roomId={"cl6qss5xm22476z6u29pgkqfqr"}/>}
                </div>
            </div>
        </section>
    );
}