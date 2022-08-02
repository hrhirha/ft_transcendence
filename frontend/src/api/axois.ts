import axios from 'axios';

export default axios.create({
    baseURL : "http://10.11.3.3:3001/",
    withCredentials: true 
});
