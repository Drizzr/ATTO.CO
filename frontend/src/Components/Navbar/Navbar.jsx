import logo from "../../assets/images/logo.png";
import Button from "../Button/Button";
import DropDown from "../Dropdown/DropDown";
import { Link } from "react-router-dom";
import NavItem from "../NavItem/NavItem";
import "./Navbar.css"
import "../../index.css"



function Navbar() {

    return (
        <nav id="navbar" className="navbar flex flex-ai-c ">
            <Link to="/" className="navbar__logo">
                <img src={logo}  width="200" alt="ATTO.CO" />
            </Link>
            <NavItem text="sick">
                <DropDown 
                    text="Menu"
                    main={[{"text": "hallo", "leftIcon": "pip", "goToMenu": "secondary"}]}
                    dropdowns={[{"name": "secondary", "items": [{"text": "hallo", "leftIcon": "pip", "rightIcon": "pip"}]}]}
                
                />
            </NavItem>
        </nav>
    )

}

export default Navbar;