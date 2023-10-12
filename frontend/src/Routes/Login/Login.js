import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";
import Alert from "../../Components/Alert/Alert";
import Button from "../../Components/Button/Button";
import "./index.css";
import "../../index.css"

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

    useEffect(() => {userRef.current.focus()}, []); // for aria-live support


    useEffect(() => {
        setErrMsg("");

    }, [pwd, email]);


    const handleSubmit =  async (e) => {
        e.preventDefault();
        
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
            return;
            
        }        
    };


    return (
        <>
            <section>
                <Alert ref={errRef}  className={errMsg ? "": " offscreen"} error={true} text={errMsg} />
                <form className="form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                    <div className="form__field">
                        <label htmlFor="email">
                            <span>Email</span>
                        </label>
                        <input
                        type="email"
                        id="email"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        ></input>
                    </div>
                    <div className="form__field">
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                            />
                    </div>
                    <Button className="margin-top margin-bottom" message="Login"/>
                    <p className="margin-bottom">
                        <span>Need an account? </span>
                        <Link to="/sign-up">Sign Up</Link>
                    </p>
                </form>
                
            </section>

        </>
    )
}

export default Login;