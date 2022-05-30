import api from "../../api/axois";

interface user_info {
    id: string,
    username: string,
    email:string,
    firstName: string,
    lastName: string,
    profileUrl: string,
    imageUrl: string,
    score: number,
    status: string,
    wins: number,
    loses: number,
}

export async function get_me() {
    const res  : user_info = (await api.get("user/me")).data;
    return res;
}