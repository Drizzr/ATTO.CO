import { useEffect, useState, useRef, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../../api/axios";
import Alert from "../../Components/Alert/Alert";
import Button from "../../Components/Button/Button";
import "../../index.css"
import "./SignUp.css"
import logo from "../../assets/images/logo.png";


const email_regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const password_regex = /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/;

const register_url = "auth/sign-up"

function SignUp() {

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/home";


    const { setAuth } = useContext(AuthContext);

    const userRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false) ;

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState("");


    useEffect(() => {userRef.current.focus()}, []);
    
    useEffect(() => {
        const result = email_regex.test(email);
        setValidEmail(result);
    }, [email]);

    useEffect(() => {
        const result = password_regex.test(pwd);
        setValidPwd(result);

        const match = pwd === matchPwd;

        setValidMatch(match);

    }, [pwd, matchPwd]);


    useEffect(() => {
        setErrMsg("");

    }, [pwd, matchPwd, email]);


    const handleSubmit =  async (e) => {
        e.preventDefault();
        const v1 = email_regex.test(email);
        const v2 = password_regex.test(pwd);

        if (!v1 || !v2) {
            setErrMsg("Invalid email or password");
            return;
        }

        try {
            const response = await axios.post(register_url, 
                JSON.stringify({
                    email: email,
                    password: pwd,
                }),
            );

            const access_token = response?.data?.x_access_token;
            setAuth({access_token, pwd, email});
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
            }  else if (err?.response?.status === 406) {
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
        <div className="authForm__container grid grid-center">
            <div className="flex flex-jc-c flex-ai-c" style={{"width": "100%"}}>
            <section className="authForm__section">
                <Alert reference={errRef}  className={errMsg ? "": " offscreen"} error={true} text={errMsg} />
                <form className="authForm" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                    <div className="authForm__field">
                        <label htmlFor="email">
                            <span>Email</span>
                            <span className={validEmail ? "authForm__success" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validEmail || !email ?
                            "hide" : "form__error"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                        className="authForm__input"
                        type="email"
                        id="email"
                        ref={userRef}
                        value={email}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-invalid={validEmail ? "false" : "true"}
                        arica-describedby="uidnote"
                        onFocus={() => setUserFocus(true)}
                        onBlur={() => setUserFocus(false)}
                        ></input>
                    </div>
                    <p id="uidnote" className={userFocus && email && !validEmail ? "form__instructions" : "offscreen"}>
                            <span>
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </span>
                        
                            4 to 24 characters <br />
                            Must begin with a letter <br />
                            Letters, numbers, underscores, and hyphens only 
                        </p>
                    <div className="authForm__field">
                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "form__success" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "form__error"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            />
                    </div>
                    <p id="pwdnote" className={pwdFocus && !validMatch ? "authForm__instructions" : "offscreen"}>
                        <span>
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </span>
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>
                    <div className="authForm__field">
                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch ? "authForm__success" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "form__error"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            />
                    </div>
                    <p id="confirmnote" className={matchFocus && !validMatch ? "authForm__instructions" : "offscreen"}>
                        <span>
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </span>
                        Must match the first password input field.
                    </p>
                    <Button className="margin-top margin-bottom" message="Sign Up"  disabled={!validEmail || !validPwd || !validMatch ? true : false}/>

                    <p className="margin-bottom">
                        <span>Already have an account? </span>
                        <Link to="/login">Log In</Link>
                    </p>
                </form>

                
                
            </section>
                <div className="authForm__image_container grid grid-center">
                    <img className="form__image" src={logo}  width="200" alt="ATTO.CO" />
                </div>
            </div>
        </div>
        
        </>
    )
}

export default SignUp;