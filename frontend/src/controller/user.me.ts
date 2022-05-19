import axios from "axios";

interface user_me {
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
    const res = await axios.get("http://127.0.0.1:3001/user/me", {
        headers:{
            Cookie : "Authentication=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbDNjeGd6OXYwMDAyejB1OGl6M3UyZnY5IiwiaXMyZmF1dGhlbnRpY2F0ZWQiOmZhbHNlLCJpYXQiOjE2NTI5NTk2NzUsImV4cCI6MTE2NTI5NTk2NzV9.zE9OI4Af-9JjlNekrPa_DHSbRInqVZ4NmTnJwhHiC4M"
        },
        withCredentials: true
    });
    console.log(res);
    return res;
}