import { faClose, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmptyHistory } from "assets";
import { get_matchs_histroy, Match } from "controller/user/matchs";
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
            <p>No matchs history yet</p>
            {location.pathname === '/profile' && <button className="playGame" onClick={() => navigate("/", {replace: true})}>
                <FontAwesomeIcon icon={faGamepad} />
                Play One
            </button>}
        </div>
    );
}

export const MatchsHistory:React.FC<{userProfile: boolean}> = ({userProfile}) => {
    const [matchs, setmatchs] = useState<Array<Match>>([]);
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
                const _matchs: Array<Match> = await get_matchs_histroy(_username);
                setmatchs(_matchs);
            }
            catch(e: any)
            {
                pushNotif({
                    id: "matchsHISTORYERROR",
                    type: "error",
                    icon: <FontAwesomeIcon icon={faClose}/>,
                    title: "ERROR",
                    description: e.message
                });
            }
        })();
    }, [userProfile, params]);

    return (
        <section id="matchsHistory">
            {matchs.length !== 0 ?  matchs.map((m) => <MatchCard key={m.id} match={m}/>) : <NoHistroy />}
        </section>
    );
}
