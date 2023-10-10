import { useEffect, useState } from 'react';
import Button from '../../Components/Button/Button';
import Alert from '../../Components/Alert/Alert';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../../api/axios';
import "./index.css"
import "../../index.css"

const url_regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;


function CreateURL() {
    const [URL, setURL] = useState('')
    const [focus, setFocus] = useState(false)
    const [shortend, setShortend] = useState("")

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
    }
    

    return (
        <section className='grid grid-center'>
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
                        id="email"
                        value={URL}
                        autoComplete="off"
                        onChange={(e) => setURL(e.target.value)}
                        required
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}
                    ></input>
                </div>
                <p id="pwdnote" className={focus && error && URL? "form__instructions" : "offscreen"}>
                    <span>
                        <FontAwesomeIcon icon={faInfoCircle} />
                    </span>
                    8 to 24 characters.<br />
                    Must include uppercase and lowercase letters, a number and a special character.<br />
                    Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </p>
                <Button message="Create!"  disabled={error ? true : false}/>
            </form>
            { shortend &&
                <div>
                    <h1>Your Custom Link:</h1>
                    <p onClick={() => {navigator.clipboard.writeText(this.state.textToCopy)}}>http://localhost:5173/{shortend}</p>
                </div>
            
            }
        </section>
        )


}


export default CreateURL;