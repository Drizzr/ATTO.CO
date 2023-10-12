import { useRef, useState } from 'react';
import Button from '../Button/Button';
import Alert from '../Alert/Alert';
import { faExclamationCircle, faClipboardList  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';
import "./index.css"
import "../../index.css"
import "../../Components/Alert/alert.css"
import ReactCardFlip from 'react-card-flip';
import { Link } from 'react-router-dom';


const url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;


function CreateUrlForm() {

    const errRef1 = useRef(null);
    const errRef2 = useRef(null);
    const errRef3 = useRef(null);

    // from allert for responses from server
    const [flag1, setFlag1] = useState(false);
    const [flag2, setFlag2] = useState(false);
    const [flag3, setFlag3] = useState(false);
    const [alertMsg1, setAlertMsg1] = useState("teset")
    const [alertMsg2, setAlertMsg2] = useState("teset")
    const [alertMsg3, setAlertMsg3] = useState("teset")


    // data from input fields and response from server
    const [URL, setURL] = useState('')
    const [wish, setWish] = useState('')
    const [shortend, setShortend] = useState("")


    // flipping animation
    const [flip, setFlip] = useState(false);

    const [focus, setFocus] = useState(false);

    const shortendRef = useRef(null);
    const urlRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = url_regex.test(URL);

        if (!v1) {
            setAlertMsg2("The URL you entered is not valid. The URL must start with http:// or https:/ and end with a domain name.");
            setFlag2(true);
            return;
        }

        if (wish.length > 10) {
            setAlertMsg3("Your URL-wish is too long. Note that it must be shorter than 10 characters.");
            setWishError(true);
            setFlag3(true);
            return;
        }

        try {
            const response = await axios.post("/create-url/", { url: URL , urlWish: wish});

            setShortend(response?.data?.short_url);
            
            handleFlip();

        } catch (err) {
            console.log(err.response)
            if (!err?.response) {
                setFlag1(true);
                setAlertMsg1("No connection to the server. Please try again later.");
                
            } else if (err?.response?.status === 406) {
                setFlag3(true);
                setAlertMsg3("Your url-wish is already in use. Please choose another one.");     
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
            <ReactCardFlip isFlipped={flip} flipDirection="vertical">
            <section className='form__section'>
                
                    <form className="form" onSubmit={handleSubmit}>
                        <h1>Create a shortend Link!</h1>
                        <Alert error={true} show={flag1} reference={errRef1}>
                            <div className='flex flex-ai-c flex-jc-sb'>
                                <span> <FontAwesomeIcon icon={faExclamationCircle}/> </span>
                                {alertMsg1}
                                <span class="closebtn" onClick={()=>{setFlag(false)}}>&times;</span> 
                            </div>
                        </Alert>
                        
                        <div className="form__field">
                            <label>
                                <span>URL</span>
                            </label>
                            <input
                                className="form__input"
                                type='text'
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
                        <Alert error={true} show={flag2} reference={errRef2} className="form__instructions">
                            <div className='flex flex-ai-c'>
                                <span> <FontAwesomeIcon icon={faExclamationCircle}/> </span>
                                {alertMsg2}
                            </div>
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
                        <Alert error={true} show={flag3} reference={errRef3} className="form__instructions">
                            <div className='flex flex-ai-c'>
                                <span> <FontAwesomeIcon icon={faExclamationCircle}/> </span>
                                {alertMsg3}
                            </div>
                        </Alert>
                        <Button message="Create!"/>
                    </form>
            </section>
            <div className='form__flip flex flex-col flex-jc-c flex-ai-c'>
                    <h1>Your Custom Link: 
                        <div className='flex flex-row flex-jc-sb flex-ai-c'>
                            <Link to={"http://localhost:5173/"+shortend}>{"http://localhost:5173/"+shortend}</Link>
                            <Button onClick={()=>{navigator.clipboard.writeText("http://localhost:5173/"+shortend)}}><FontAwesomeIcon icon={faClipboardList} /></Button>
                        </div>

                    </h1>
                <Button onClick={()=>{handleFlip(); urlRef.current.value=""; setURL(""); shortendRef.current.value=""; setWish(""); setFlag1(false); setFlag2(false); setFlag3(false)}} message="create another link"/>

            </div>
            </ReactCardFlip>

        
        </>
        
        )


}


export default CreateUrlForm;