import { jwtDecode } from "jwt-decode";
import { findUser } from "../apis";
import useUserStore from "../store/userStore";

async function setUserDataInStorage() {
    console.log("Mi ailu");
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            throw new Error('No access token found');
        }
        const decodedToken = jwtDecode(token);
        const uid = await decodedToken.uid; // Assuming 'uid' is in the token payload
        const response = await findUser({ uid });
        const setUser = useUserStore.getState().setUser;
        setUser(response.data);

        return response.data;
    } catch (error) {
        console.error('Error setting user data:', error);
        throw error;
    }
}

export default setUserDataInStorage;