import api from "../../api/axois";

// https://www.nicesnippets.com/blog/react-js-file-upload-example-with-axios

export async function post_friend_accept(imagePath : string) {
    // "avatar/upload"
    try {

        let formData = new FormData();
        var imagefile : any = document.querySelector(imagePath);
        formData.append("image", imagefile.files[0]);

        api.post("avatar/upload", formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
    }catch (err) {
        return new Error("error : " + err);
    }
}