import { createContext, useEffect, useRef, useState } from 'react';
import Button from '../../Components/Button/Button';
import Alert from '../../Components/Alert/Alert';
import { faCheck, faTimes, faInfoCircle, faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';
import "./index.css"
import "../../index.css"
import "../../Components/Alert/alert.css"
import Header from '../../Components/Header/Header';
import ReactCardFlip from 'react-card-flip';
import { Link } from 'react-router-dom';


const url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;


function CreateURL() {

    // from allert for responses from server
    const [flag, setFlag] = useState(false);
    const [alertMsg, setAlertMsg] = useState("teset")


    // data from input fields and response from server
    const [URL, setURL] = useState('')
    const [wish, setWish] = useState('')
    const [shortend, setShortend] = useState("")


    // flipping animation
    const [flip, setFlip] = useState(false);

    
    // error box under input field
    const [urlError, setURLError] = useState(false)
    const [wishError, setWishError] = useState(false)

    const shortendRef = useRef(null);
    const urlRef = useRef(null);

    useEffect(() => {
    
        if (URL.match(url_regex)) {
            setURLError(false)
        } else {
            setURLError(true)
        }
    }, [URL])

    useEffect(() => {
    
        if (wish.length <= 10) {
            setWishError(false);
        } else {
        
            setWishError(true);
        }
    
    }, [wish])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = url_regex.test(URL);

        if (!v1) {
            setAlertMsg("Invalid URL");
            return;
        }

        try {
            const response = await axios.post("/create-url/", { url: URL , urlWish: wish});

            setShortend(response?.data?.short_url);
            
            handleFlip();

        } catch (err) {
            console.log(err.response)
            if (!err?.response) {
                setFlag(true);
                setAlertMsg("No connection to the server. Please try again later.");
                
            } else if (err?.response?.status === 406) {
                setFlag(true);
                setAlertMsg("Your url-wish is already in use. Please choose another one.");     
                shortendRef.current.value = "";    
                setWish("");
            }
            
        }
    }

    const handleFlip = () => {
    
        setFlip(!flip);
    }
    

    return (
        <>
        <Header>
            <h1>
            Optimize your links seamlessly with ATTO.CO. Streamline your URLs for enhanced sharing and tracking. Begin by entering your URL below. Elevate your online presence effortlessly.
            </h1>
            <ReactCardFlip isFlipped={flip} flipDirection="vertical">
            <section className='form__section'>
                
                    <form className="form" onSubmit={handleSubmit}>
                        <h1>Create a shortend Link!</h1>
                        <Alert error={true} show={flag}>
                            {alertMsg}
                            <span class="closebtn" onClick={()=>{setFlag(false)}}>&times;</span> 
                        </Alert>
                        
                        <div className="form__field">
                            <label>
                                <span>URL</span>
                                <span className={!urlError ? "form__success" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={urlError && URL?
                                    "form__error" : "hide"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <input
                                className="form__input"
                                type='url'
                                id='url'
                                ref={urlRef}
                                value={URL}
                                autoComplete="off"
                                onChange={(e) => setURL(e.target.value)}
                                required
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                placeholder='f.e.: https://www.google.com'
                            ></input>
                        </div>
                        <Alert show={Boolean(urlError && URL)} error={true} className="form__instructions">
                            <span>
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </span>
                            Note that the URL must start with http:// or https://
                        </Alert>
                        <div className="form__field">
                            <label>
                                <span>Your dream URL!</span>
                            </label>
                            <div className='flex flex-ai-c'>
                                <h1 className='margin-right'>atto.co<span className='margin-left'>/</span></h1>
                                <input
                                    className="form__input"
                                    type='text'
                                    id='shortend'
                                    ref={shortendRef}
                                    autoComplete='off'
                                    placeholder='iLoveYou'
                                    onChange={(e) => setWish(e.target.value)}
                                ></input>
                            </div>
                        </div>
                        <Alert show={Boolean(wishError && wish)} className={"form__instructions"} error={true}>
                            <span>
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </span>
                            Your custom must not be longer than 10 characters.
                            Note that this field is not required.
                        </Alert>
                        <Button message="Create!"  disabled={urlError&&wishError ? true : false}/>
                    </form>
            </section>
            <div className='form__flip flex flex-col flex-jc-c flex-ai-c'>
                    <h1>Your Custom Link: 
                        <div className='flex flex-row flex-jc-sb flex-ai-c'>
                            <Link to={"http://localhost:5173/"+shortend}>{"http://localhost:5173/"+shortend}</Link>
                            <Button onClick={()=>{navigator.clipboard.writeText("http://localhost:5173/"+shortend)}}></Button>
                        </div>

                    </h1>
                <Button onClick={()=>{handleFlip(); urlRef.current.value="", setURL(""), shortendRef.current.value="", setWish("")}} message="create another link"/>

            </div>
            </ReactCardFlip>
        </Header>
        
        </>
        
        )


}


export default CreateURL;