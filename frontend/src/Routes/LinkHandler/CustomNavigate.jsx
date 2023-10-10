import axios from "../../api/axios";
import { useEffect, useState } from "react"
import { redirect, useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function CustomNavigate() {

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
        <>{render &&
    
        <p>
            Ooops this url does not exist!!
            <p>
                <span>Need a shortend link? </span>
                <Link to="/"> Create one!</Link>
            </p>
            
            
        </p>}

        </>
    )


}

export default CustomNavigate