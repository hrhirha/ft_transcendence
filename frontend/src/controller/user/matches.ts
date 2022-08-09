import api from "api/axois";
import { User } from "controller/user/user";

export interface Match {
    id: string,
    map: string,
    is_ultimate: boolean,
    p1: User,
    p2: User,
    score: {
        p1: number,
        p2: number
    }
}

export async function get_matches_histroy(username : string) {
    try
    {
        const res : Array<Match> = (await api.get("game/match_history/"+ username )).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function get_ongoing_matches() {
    try
    {
        const res : Array<Match> = (await api.get("/game/ongoing")).data;
        return res;
    } catch(e: any) {
        throw (e.response.data);
    }
}