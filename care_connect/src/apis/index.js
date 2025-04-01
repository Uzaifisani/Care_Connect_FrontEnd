import axios from "axios";

const API_URl='http://localhost:5000';
export const loginApi=async(FormData)=>{
    console.log(FormData.email);
    const response =await axios.post(`${API_URl}/api/auth/signin`,FormData);
    return response;
}