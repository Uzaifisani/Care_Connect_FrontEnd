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

export const findUser = async (uid) => {
    const token = localStorage.getItem('accessToken'); 
    const response = await axios.post(
        `${API_URl}/api/users/finduser`,
        uid,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response;
}

export const generateStats = async () => {
    const token = localStorage.getItem('accessToken'); 
    const response = await axios.get(
        `${API_URl}/api/generate/stats`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response;
}

export const ListAllDoctors= async()=>{
    const token = localStorage.getItem('accessToken'); 
    const response = await axios.get(
        `${API_URl}/api/users/doctors`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response;
}

export const ListAllStaffs= async()=>{
    const token = localStorage.getItem('accessToken'); 
    const response = await axios.get(
        `${API_URl}/api/users/staffs`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response;
}

export const ListUnverified= async()=>{
    const token = localStorage.getItem('accessToken'); 
    const response = await axios.get(
        `${API_URl}/api/users/unverified`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response;
}

export const getAllFeedbacks= async()=>{
    const token = localStorage.getItem('accessToken'); 
    const response = await axios.get(
        `${API_URl}/api/users/feedbacks`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response;
}

export const EditUser= async(UpdatedDetails)=>{
    const token = localStorage.getItem('accessToken'); 
    const response = await axios.post(
        `${API_URl}/api/users/unverified/verify `,
        UpdatedDetails,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response;
}

export const VerifyUser= async(uid)=>{
    const token = localStorage.getItem('accessToken'); 
    const response = await axios.post(
        `${API_URl}/api/users/unverified/verify`,
        uid,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response;
}


export const RejectUser= async(uid)=>{
    const token = localStorage.getItem('accessToken'); 
    const response = await axios.post(
        `${API_URl}/api/users/unverified/reject`,
        uid,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return response;
}
