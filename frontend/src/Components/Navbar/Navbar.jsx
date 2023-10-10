import logo from "../../assets/images/logo.png";
import Button from "../Button/Button";
import DropDown from "../Dropdown/DropDown";
import { Link } from "react-router-dom";
import "./Navbar.css"
import "../../index.css"



function Navbar() {

    return (
        <nav id="navbar" className="navbar flex flex-ai-c ">
            <Link to="/" className="navbar__logo">
                <img src={logo}  width="200" alt="ATTO.CO" />
            </Link>
        </nav>
    )

}

export default Navbar;