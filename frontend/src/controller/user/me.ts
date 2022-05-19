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

export async function get_user_me() {
    // "user/me"
    const res  : user_info = (await api.get("contact")).data;
    console.log(res);
    return res;
}