import { faClose, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmptyHistory } from "assets";
import { get_matches_histroy, Match } from "controller/user/matches";
import { get_me, User } from "controller/user/user";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MatchCard } from "views/components/match_card/match_card";
// import { MatchCard } from "views/components/match_card/match_card";
import { useNotif } from "views/components/notif/notif";


const NoHistroy = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="noHistory">
            <img src={EmptyHistory} alt="no history" />
            <p>No matches history yet</p>
            {location.pathname === '/profile' && <button className="playGame" onClick={() => navigate("/")}>
                <FontAwesomeIcon icon={faGamepad} />
                Play One
            </button>}
        </div>
    );
}

export const MatchesHistory:React.FC<{userProfile: boolean}> = ({userProfile}) => {
    const [matches, setMatches] = useState<Array<Match>>([]);
    const params = useParams();
    const pushNotif = useNotif();

    useEffect(() => {
        (async () => {
            let _username: string;
            try {
                if (userProfile)
                {
                    const me: User = await get_me();
                    _username = me.username;
                }
                else {
                    _username = params.username!;
                }
                const _matches: Array<Match> = await get_matches_histroy(_username);
                console.log(_matches)
                setMatches(_matches);
            }
            catch(e: any)
            {
                pushNotif({
                    id: "MATCHESHISTORYERROR",
                    type: "error",
                    icon: <FontAwesomeIcon icon={faClose}/>,
                    title: "ERROR",
                    description: e.message
                });
            }
        })();
    }, [userProfile, params]);

    return (
        <section id="matchesHistory">
            {matches.length !== 0 ?  matches.map((m) => <MatchCard match={m}/>) : <NoHistroy />}
        </section>
    );
}
