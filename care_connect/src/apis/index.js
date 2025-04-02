import axios from "axios";

const API_URl='http://localhost:5000';
export const loginApi=async(FormData)=>{
    const response =await axios.post(`${API_URl}/api/auth/signin`,FormData);
    return response;
}

export const RegisterApi= async(FormData)=>{
    const response=await axios.post(`${API_URl}/api/auth/signup`,FormData);
    return response;
}