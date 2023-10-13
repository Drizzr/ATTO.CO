import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import Alert from "../../Components/Alert/Alert";
import Button from "../../Components/Button/Button";
import "../../index.css";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const login_url = "/auth/login"

function Login() {

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/home";

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState("");

    const [pwd, setPwd] = useState("");

    const [errMsg, setErrMsg] = useState("");
    const [flag1, setFlag1] = useState(false);

    const [flag2, setFlag2] = useState(false);
    const [flag3, setFlag3] = useState(false);

    useEffect(() => {userRef.current.focus()}, []); // for aria-live support


    useEffect(() => {
        setFlag2(false);

    }, [email]);


    useEffect(() => {
        setFlag3(false);

    }, [pwd]);


    const handleSubmit =  async (e) => {
        e.preventDefault();

        if (email === "") {
        
            setErrMsg("Please enter your email");
            setFlag1(true);
            setFlag2(true);
            return;
        }

        if (pwd === "") {
        
            setErrMsg("Please enter your password");
            setFlag1(true);
            setFlag3(true);
            return;
        }
        
        try {
            const response = await axios.post(login_url,
                JSON.stringify({ email: email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withcredentials: true
                }
            );

            

            const access_token = response?.data?.x_access_token;
            
            setAuth({access_token, pwd, email});
            //setEmail('');
            //setPwd('');
            navigate(from, {replace : true});
            

        } catch (err) {
            //errRef.current.focus(); // for aria-live support
            if (!err?.response) {
                setErrMsg("No connection to the server. Please try again later.");
                
                
            } else if (err?.response?.status === 401) {
                setErrMsg("Invalid email or password");
            } else if (err?.response?.status === 500) {
                setErrMsg("Server error. Please try again later.");
            } else if (err?.response?.status === 400) {
                setErrMsg("Invalid email or password");
            } else if (err?.response?.status === 406) {
                setErrMsg("Wrong email or password");
            } else {
                setErrMsg("Unknown error. Please try again later.");
            }
            //errRef.current.focus();
            setFlag1(true);
            return;
            
        }        
    };


    return (
        <>
        <div className="flex flex-jc-c">
            <Alert className="authForm__alert" error={true} show={flag1} reference={errRef}>
                    <div className='flex flex-ai-c flex-jc-sb'>
                        <span> <FontAwesomeIcon icon={faExclamationCircle}/> </span>
                        {errMsg}
                        <span className="closebtn" onClick={()=>{setFlag1(false)}}>&times;</span> 
                    </div>
            </Alert>
        </div>
        <div className="grid grid-center" style={{"height": "100vh"}}>
        <section>
                <form className="authForm" onSubmit={handleSubmit}>
                <h1>Login</h1>
                    <div className="authForm__field">
                        <label htmlFor="email">
                            <span>Email</span>
                        </label>
                        <input
                        className={"authForm__input " + (flag2 ? "authForm__input_error" : "")}
                        type="email"
                        id="email"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        ></input>
                    </div>
                    <div className="authForm__field">
                            <label htmlFor="password">Password:</label>
                            <input
                                className={"authForm__input " + (flag3 ? "authForm__input_error" : "")}
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                            />
                    </div>
                    <Button className="margin-top margin-bottom" message="Login"/>
                    <p className="margin-bottom">
                        <span>Need an account? </span>
                        <Link to="/sign-up">Sign Up</Link>
                    </p>
                </form>
                
            </section>
        </div>
        

        </>
    )
}

export default Login;