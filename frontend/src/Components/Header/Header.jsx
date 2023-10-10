import Navbar from "../Navbar/Navbar";
import DropDown from "../Dropdown/DropDown";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";
import "./Header.css";



function Header(props) { 

    const navigate = useNavigate();
    
    return (
        <header className="header">
            <Navbar />
            <div className="header__intro flex flex-col flex-ai-sa flex-jc-se">
                {props.children}
            </div>
        </header>
    )
}


export default Header;