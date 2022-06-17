import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmptyHistory } from "../../../../assets";
import { MatchCard } from "../../../components/match_card/match_card";


const NoHistroy = () => {
    return (
        <div className="noHistory">
            <img src={EmptyHistory} alt="no history" />
            <p>No matches history yet</p>
            <button className="playGame">
                <FontAwesomeIcon icon={faGamepad} />
                Play One
            </button>
        </div>
    );
}

export const MatchesHistory:React.FC = () => {
    return (
        <section id="matchesHistory">
            {/* <NoHistroy /> */}
            <MatchCard
                matchId="MATCH001"
                gameModePro={true}
                player1={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=11",
                        "fullName": "Player1 Full Name",
                        "ranking": 1,
                        "score": 10
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=18",
                        "fullName": "Player2 FulName",
                        "ranking": 2,
                        "score": 8
                    }
                }
                onClick={() => {}}
                />
            <MatchCard
                matchId="MATCH002"
                gameModePro={false}
                player1={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=21",
                        "fullName": "Player1",
                        "ranking": 12,
                        "score": 2
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=38",
                        "fullName": "Player2",
                        "ranking": 5,
                        "score": 10
                    }
                }
                onClick={() => {}}
                />
            <MatchCard
                matchId="MATCH001"
                gameModePro={true}
                player1={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=11",
                        "fullName": "Player1 Full Name",
                        "ranking": 1,
                        "score": 10
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=18",
                        "fullName": "Player2 FulName",
                        "ranking": 2,
                        "score": 8
                    }
                }
                onClick={() => {}}
                />
            <MatchCard
                matchId="MATCH002"
                gameModePro={false}
                player1={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=21",
                        "fullName": "Player1",
                        "ranking": 12,
                        "score": 2
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=38",
                        "fullName": "Player2",
                        "ranking": 5,
                        "score": 10
                    }
                }
                onClick={() => {}}
                />
                
        </section>
    );
}
