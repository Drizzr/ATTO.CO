import "./alert.css";
import "../../index.css"
import { CSSTransition } from "react-transition-group";


function Alert(props) {
    
    
    return (
    <CSSTransition in={props.show} nodeRef={props.ref} unmountOnExit timeout={300} classNames="alert__animation">
        <div  ref={props.ref} className={"alert " + (props.error ? "alert__error " : "alert__success ") + (props.className ? props.className : "")}>
            {props.children}
        </div>
    </CSSTransition>
    )
}

export default Alert