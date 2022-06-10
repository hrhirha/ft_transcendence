import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmptyHistory } from "../../../../assets";


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
            <NoHistroy />
        </section>
    );
}
