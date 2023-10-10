import "./alert.css";
import { useState } from "react";

function Alert(props) {
  
    const [flag,setFlag]=useState(true);

    return (
    <div  ref={props.ref} class={(flag ? props.error ? "alert alert__error" : "alert alert__success" : "hide") + props.className} onClick={()=>{setFlag(false)}}>
        <span class="closebtn">&times;</span> 
          {props.text}
    </div>
    )
}

export default Alert