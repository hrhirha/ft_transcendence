import api from "../../api/axois";

export async function patch_edit_username(user_username : string) {
    const res  = await api.patch("user/edit/username", {username : user_username});
    return res.data;
}

export async function patch_edit_fullname(user_fullName : string) {
    const res  = await api.patch("user/edit/fullname", {fullName : user_fullName});
    return res.data;
}

export async function patch_avatar_upload(image : File) {
    const formData = new FormData();
    formData.append("file", image);
    api.patch('user/edit/avatar', formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    })
}


