import { Bronze, Diamond, Gold, GoldStar, Silver } from "../../../assets";

export const Achievement:React.FC<{score: number}> = ({score}) => {

    const getAchievement = () => {
        if (score >= 10000)
            return (["Diamond", Diamond]);
        if (score >= 5000)
            return (["Gold Star", GoldStar]);
        if (score >= 2000)
            return (["Gold", Gold]);
        if (score >= 1000)
            return (["Silver", Silver]);
        if (score >= 150)
            return (["Bronze", Bronze]);
    }

    return (<>{(score > 100) && <span className="achievement">
            <img src={getAchievement()![1]} title={getAchievement()![0]} alt="achievement" />
        </span>}</>);
}