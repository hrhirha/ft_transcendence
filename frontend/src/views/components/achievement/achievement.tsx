import { BronzeBadge, DiamondBadge, GoldBadge, SilverBadge, IronBadge, WoodBadge } from "assets";

export const Achievement:React.FC<{score: number}> = ({score}) => {

    const getAchievement = () => {
        if (score >= 10000)
            return (["Diamond", DiamondBadge]);
        if (score >= 5000)
            return (["Gold", GoldBadge]);
        if (score >= 2000)
            return (["Silver", SilverBadge]);
        if (score >= 1000)
            return (["Bronze", BronzeBadge]);
        if (score >= 500)
            return (["Iron", IronBadge]);
        return (["Wood", WoodBadge]);
    }

    return (<span className="achievement"><img src={getAchievement()![1]} title={getAchievement()![0]} alt="achievement" /></span>);
}