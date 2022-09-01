import api from "index";

export async function patch_edit_username(user_username : string) {
    try {
        const res  = await api.patch("user/edit/username", {username : user_username});
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function patch_edit_fullname(user_fullName : string) {
    try {
        const res  = await api.patch("user/edit/fullname", {fullName : user_fullName});
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}

export async function patch_avatar_upload(image : File) {
    try {
        const formData = new FormData();
        formData.append("file", image);
        const res  =  await api.patch('user/edit/avatar', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch(e: any) {
        throw (e.response.data);
    }
}


