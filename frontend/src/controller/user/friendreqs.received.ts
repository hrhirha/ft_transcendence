import api from "../../api/axois";

interface user_info {
    id: string,
    createdAt: string,
    updatedAt: string,
    username: string,
    email:string,
    firstName: string,
    lastName: string,
    profileUrl: string,
    imageUrl: string,
    refresh_token: any,
    isTfaEnabled: boolean,
    tfaSecret: any,
    score: number,
    status: any,
    wins: number,
    loses: number,
}

export async function get_friendreqs_received() {
    // "user/friendreqs/received"
    const res : user_info[] = (await api.get("contact")).data;
    console.log(res);
    return res;
}