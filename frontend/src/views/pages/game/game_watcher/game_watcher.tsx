import { get_ongoing_matches, Match } from "controller/user/matches";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { GameView } from "views/pages/game/game_view/game_view";

export const GameWatcher:React.FC = () =>  {
    const socket = io("ws://127.0.0.1:3001/game", {withCredentials: true});
    const [ongoingMatches, setMatches] = useState<Array<Match>>([]);

    useEffect(() => {
        (async () => {
            try {
                const _matches = await get_ongoing_matches();
                setMatches(_matches);
            } catch(e: any) {}
        })();
    },[]);

    return (
        <section id="gameWatcher">
            {ongoingMatches.length === 0 && <img className="nolivegames" />}
            {ongoingMatches.length > 0 && <GameView gameSocket={socket} isUltimate={false} watcher={true} roomId={"cl6rtkk2h166906zspkjsbx04l"}/>}
        </section>
    );
}