import useRefreshToken from "./useRefreshToken";
import { axiosWithAuth } from "../api/axios";
import { useEffect } from "react";
import useAuth from "./useAuth";


const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();


    useEffect(() => {


        const requestInterceptor = axiosWithAuth.interceptors.request.use(
                config => {
                    if (!config.headers['x_access_token']) {
                        config.headers['x_access_token'] = auth?.access_token;
                        return config;
                    }
                    
                }, (error) => Promise.reject(error)
            )

        const responseInterceptor = axiosWithAuth.interceptors.response.use(
                response => response,

                async error => {
                
                    const previousRequest = error?.config;

                    if (error.response.status === 403 && !previousRequest?.sent) {

                        const new_access_token = await refresh();

                        previousRequest.headers['x_access_token'] = new_access_token;

                        return axiosWithAuth(previousRequest);
                    }
                    return Promise.reject(error);
                }
            );

        return () => {
            axiosWithAuth.interceptors.response.eject(responseInterceptor);
            axiosWithAuth.interceptors.request.eject(requestInterceptor);
        }
    
    }, [auth, refresh]);

    return axiosWithAuth
}


export default useAxiosPrivate;