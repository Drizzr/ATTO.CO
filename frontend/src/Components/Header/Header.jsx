import Navbar from "../Navbar/Navbar";
import "./Header.css";



function Header(props) { 
    
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