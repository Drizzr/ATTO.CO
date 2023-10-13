import { useEffect, useState, useRef, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
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

    const emailRef = useRef();
    const errRef1 = useRef();
    const errRef2 = useRef();
    const errRef3 = useRef();
    const errRef4 = useRef();

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false) ;

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg1, setErrMsg1] = useState("");
    const [flag1, setFlag1] = useState(false);

    const [errMsg2, setErrMsg2] = useState("");
    const [flag2, setFlag2] = useState(false);

    const [errMsg3, setErrMsg3] = useState("");
    const [flag3, setFlag3] = useState(false);

    const [errMsg4, setErrMsg4] = useState("");
    const [flag4, setFlag4] = useState(false);


    useEffect(() => {emailRef.current.focus()}, []);
    
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



    const handleSubmit =  async (e) => {
        e.preventDefault();
        const v1 = email_regex.test(email);
        const v2 = password_regex.test(pwd);

        if (email === "") {
            setErrMsg2("Please enter your email");
            setFlag2(true);
            return;
        }

        if (!v1) {
            setErrMsg2("The email you entered is not valid. Please enter a valid email.");
            setFlag2(true);
            return;
        }

        if (!v2) {
            setErrMsg3("The password you entered is not valid. Please enter a valid password.");
            setFlag3(true);
            return;
        }

        if (pwd !== matchPwd) {
            setErrMsg4("The passwords you entered do not match. Please enter the same password twice.");
            setFlag4(true);
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
                setErrMsg1("No connection to the server. Please try again later.");
                
            } else if (err?.response?.status === 401) {
                setErrMsg1("Invalid email or password");
            } else if (err?.response?.status === 500) {
                setErrMsg1("Server error. Please try again later.");
            } else if (err?.response?.status === 400) {
                setErrMsg1("Invalid email or password");
            }  else if (err?.response?.status === 406) {
                setErrMsg1("This email is already in use!");
                emailRef.current.value = "";
                setEmail("");
            } else {
                setErrMsg1("Unknown error. Please try again later.");
                
            }
            
            setFlag1(true);
            return;
            
        }
        

    };


    return (
        <>
        <div className="flex flex-jc-c">
            <Alert className="authForm__alert" error={true} show={flag1} reference={errRef1}>
                    <div className='flex flex-ai-c flex-jc-sb'>
                        <span> <FontAwesomeIcon icon={faExclamationCircle}/> </span>
                        {errMsg1}
                        <span class="closebtn" onClick={()=>{setFlag1(false)}}>&times;</span> 
                    </div>
            </Alert>
        </div>
        <div className="authForm__container grid grid-center">
            <section className="authForm__section">
                <form className="authForm" onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                    <div className="authForm__field">
                        <label htmlFor="email" className="flex flex-ai-c">
                            <span>Email: </span>
                            <span className={validEmail ? "authForm__success" : "hide"}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validEmail || !email ?
                            "hide" : "form__error"}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            className={"authForm__input " + (flag2 ? "authForm__input_error" : "")}
                            type="email"
                            id="email"
                            ref={emailRef}
                            value={email}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={validEmail ? "false" : "true"}
                            arica-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        ></input>
                    </div>
                    <Alert error={true} show={flag2} reference={errRef2} className="authForm__instructions">
                        <div className='flex flex-ai-c flex-jc-sb'>
                            <span> <FontAwesomeIcon icon={faExclamationCircle}/> </span>
                            {errMsg2}
                        </div>
                    </Alert>
                
                    <div className="authForm__field">
                        <label htmlFor="password">
                            Password: 
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "authForm__success" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "authForm__error"} />
                        </label>
                        <input
                            className={"authForm__input " + (flag3 ? "authForm__input_error" : "")}
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            />
                    </div>
                    <Alert error={true} show={flag3} reference={errRef3} className="authForm__instructions">
                        <div className='flex flex-ai-c flex-jc-sb'>
                            <span> <FontAwesomeIcon icon={faExclamationCircle}/> </span>
                            {errMsg3}
                        </div>
                    </Alert>

                    <div className="authForm__field">
                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch ? "authForm__success" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "authForm__error"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            className={"authForm__input " + (flag4 ? "authForm__input_error" : "")}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                            />
                    </div>
                    <Alert error={true} show={flag4} reference={errRef4} className="form__instructions">
                        <div className='flex flex-ai-c flex-jc-sb'>
                            <span> <FontAwesomeIcon icon={faExclamationCircle}/> </span>
                            {errMsg4}
                        </div>
                    </Alert>

                    <Button className="margin-top margin-bottom" message="Sign Up"/>

                    <p className="margin-bottom">
                        <span>Already have an account? </span>
                        <Link to="/login">Log In</Link>
                    </p>
                </form>

                
                
            </section>
                
        </div>
        
        </>
    )
}

export default SignUp;