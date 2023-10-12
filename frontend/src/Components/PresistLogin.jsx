import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import {Oval} from "react-loader-spinner"
import "../index.css"

const PresistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const {auth} = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        verifyRefreshToken();

        !auth?.acccess_token ? verifyRefreshToken(): setIsLoading(false);
    }, [auth, refresh]);

    useEffect(() => {
        console.log("isLoading: ", isLoading);
        console.log("auth: ", auth);
    }, [isLoading, auth]);

    return(
        <>
            {isLoading ? <div className="grid grid-center" style={{"height": "100vh"}}><Oval color="white" secondaryColor="grey"/></div> : <Outlet />}
        </>
        
        )
};


export default PresistLogin;