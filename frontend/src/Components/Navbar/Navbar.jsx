import logo from "../../assets/images/logo.png";
import Button from "../Button/Button";
import DropDown from "../Dropdown/DropDown";


function Navbar() {

    return (
        <nav id="navbar" className="navbar flex flex-ai-c ">
            <Link to="/" className="navbar__logo">
                <img src={logo}  width="300" alt="ATTO.CO" />
            </Link>
        </nav>
    )

}

export default Navbar;