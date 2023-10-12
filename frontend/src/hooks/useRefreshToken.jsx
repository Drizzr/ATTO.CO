import axios from "../api/axios"
import useAuth from "./useAuth"


function useRefreshToken() {

    const { setAuth } = useAuth();
    const refresh_url = "/auth/refresh"
    const refresh = async () => {
        const response = await axios.get(refresh_url,
            {
                headers: { 'Content-Type': 'application/json' },
                withcredentials: true
            });
        
        setAuth(prev =>{
            console.log(JSON.stringify(prev));
            console.log(JSON.stringify(response.data?.x_access_token));

            return {
                ...prev,
                access_token: response.data?.x_access_token,
            }
        });

        return response.data?.x_access_token;
    }

  return refresh;
}

export default useRefreshToken