import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmptyHistory } from "assets";
import { MatchCard } from "views/components/match_card/match_card";


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
                        "username": "zel-bagh",
                        "fullName": "Player1 Full Name",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=18",
                        "username": "abahdir",
                        "fullName": "Player2 FulName",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                score={{
                    "player1": 0,
                    "player2": 0
                }}
                onClick={() => {}}
                /><MatchCard
                matchId="MATCH001"
                gameModePro={true}
                player1={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=11",
                        "username": "zel-bagh",
                        "fullName": "Player1 Full Name",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=18",
                        "username": "abahdir",
                        "fullName": "Player2 FulName",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                score={{
                    "player1": 0,
                    "player2": 0
                }}
                onClick={() => {}}
                /><MatchCard
                matchId="MATCH001"
                gameModePro={true}
                player1={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=11",
                        "username": "zel-bagh",
                        "fullName": "Player1 Full Name",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=18",
                        "username": "abahdir",
                        "fullName": "Player2 FulName",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                score={{
                    "player1": 0,
                    "player2": 0
                }}
                onClick={() => {}}
                /><MatchCard
                matchId="MATCH001"
                gameModePro={true}
                player1={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=11",
                        "username": "zel-bagh",
                        "fullName": "Player1 Full Name",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=18",
                        "username": "abahdir",
                        "fullName": "Player2 FulName",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                score={{
                    "player1": 0,
                    "player2": 0
                }}
                onClick={() => {}}
                /><MatchCard
                matchId="MATCH001"
                gameModePro={true}
                player1={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=11",
                        "username": "zel-bagh",
                        "fullName": "Player1 Full Name",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                player2={
                    {
                        "avatar": "https://i.pravatar.cc/300?img=18",
                        "username": "abahdir",
                        "fullName": "Player2 FulName",
                        "ranking": {
                            "title": "Wood",
                            "icon" : "http://127.0.0.1:3001/rank/wood_game_icon.svg",
                            "field" : ""
                        }
                    }
                }
                score={{
                    "player1": 0,
                    "player2": 0
                }}
                onClick={() => {}}
                />
                
        </section>
    );
}
