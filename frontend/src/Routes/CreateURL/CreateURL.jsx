import { useEffect, useState } from 'react';
import Button from '../../Components/Button/Button';
import Alert from '../../Components/Alert/Alert';
import { faCheck, faTimes, faInfoCircle, faClipboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';
import "./index.css"
import "../../index.css"
import Header from '../../Components/Header/Header';
import ReactCardFlip from 'react-card-flip';
import { Link } from 'react-router-dom';

const url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;


function CreateURL() {
    const [URL, setURL] = useState('')
    const [focus, setFocus] = useState(false)
    const [shortend, setShortend] = useState("")

    const [flip, setFlip] = useState(false);

    const [errMsg, setErrMsg] = useState("")

    const [error, setError] = useState(false)

    useEffect(() => {
    
        if (URL.match(url_regex)) {
            setError(false)
        } else {
            setError(true)
        }
    }, [URL])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = url_regex.test(URL);

        if (!v1) {
            setErrMsg("Invalid URL");
            return;
        }

        try {
            const response = await axios.post("/create-url/", { url: URL });

            setShortend(response?.data?.short_url);
        
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No connection to the server. Please try again later.");
                
            } else if (err?.response?.status === 406) {
                setErrMsg("A shortend link for this URL already exists.");
                setShortend(err?.response?.data.short_url);
                
            }
            
        }

        handleFlip();
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
                        
                        <div className="form__field">
                            <label htmlFor="email">
                                <span>URL</span>
                                <span className={!error ? "form__success" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span className={error && URL?
                                    "form__error" : "hide"}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                            </label>
                            <input
                                className="form__input"
                                type='url'
                                id='url'
                                value={URL}
                                autoComplete="off"
                                onChange={(e) => setURL(e.target.value)}
                                required
                                onFocus={() => setFocus(true)}
                                onBlur={() => setFocus(false)}
                                placeholder='f.e.: https://www.google.com'
                            ></input>
                        </div>
                        <p id="pwdnote" className={focus && error && URL? "form__instructions" : "offscreen"}>
                            <span>
                                <FontAwesomeIcon icon={faInfoCircle} />
                            </span>
                            Note that the URL must start with http:// or https://
                        </p>
                        <Button message="Create!"  disabled={error ? true : false}/>
                    </form>
            </section>
            <div className='form__flip flex flex-col flex-jc-c flex-ai-c'>
                    <h1>Your Custom Link: 
                        <div className='flex flex-row flex-jc-sb flex-ai-c'>
                            <Link to={"http://localhost:5173/"+shortend}>{"http://localhost:5173/"+shortend}</Link>
                            <Button onClick={()=>{navigator.clipboard.writeText("http://localhost:5173/"+shortend)}}><FontAwesomeIcon icon="fas fa-clipboard" /></Button>
                        </div>

                    </h1>
                <Button onClick={handleFlip} message="create another link"/>
            </div>
            </ReactCardFlip>
        </Header>
        </>
        
        )


}


export default CreateURL;