import "./button.css"

function Button(props) {
    return (
        <button className={"buttons " + props.className}  disabled={props.disabled} onClick={props.onClick}>{props.message}</button>
        )
}

export default Button;