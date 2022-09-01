import api from "index";

export async function get_leader_board() {
    try {
        const res: any  = await api.get("/game/leaderboard");
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}