import axios from "../../api/axios";
import { useEffect, useState } from "react"
import { redirect, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {Oval} from "react-loader-spinner"
import Header from "../../Components/Header/Header";

function LinkHandler() {

    const [render, setRender] = useState(false);
    const navigate = useNavigate();
    const shortend = useParams()?.shortend;

    useEffect(() => {
        const checkURL = async (e) => {

            try {
                const response = await axios.get(`/${shortend}`)
    
                if (response.status === 200) {
                    console.log(response.data.url)
                    window.location.href = response.data.url;
                }
            
            
            } catch (err) {
                setRender(true);
            }
        }

        checkURL();
    
    }, [])


    return (
        <>
            {!render ? <div className="grid grid-center" style={{"height": "100vh"}}><Oval color="white" secondaryColor="grey"/></div> :
            <Header>
                <h1>
                    Ooops this url does not exist! 🧐
                    <p>
                        <span>Need a shortend link? </span>
                        <Link to="/"> Create one!</Link>
                    </p>
                    
                    
                </h1>

            </Header>
            
            }

        </>
    )


}

export default LinkHandler;