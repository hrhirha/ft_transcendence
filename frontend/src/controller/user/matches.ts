import api from "api/axois";

export interface Match {
    id: string,
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