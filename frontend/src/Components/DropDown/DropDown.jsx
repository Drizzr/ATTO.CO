import "./DropDown.css";
import "../../index.css"
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";



function DropDown(props) {

    const [open, setOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("main")
    const [menuHeight, setMenuHeight] = useState(null);
    
    const arrowRef = useRef(null);

    const dropdownRef = useRef(null);

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    useEffect(() => {
        arrowRef.current.style.transform = open ? "rotate(180deg)" : "rotate(0deg)";
        setActiveMenu("main");
    
    }, [open])

    useEffect(() => {
        setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
      }, [])

    function DropDownItem(props) {
        return (
            <a href="#" className="dropdown__item" onClick={()=>props.goToMenu && setActiveMenu(props.goToMenu)}>
                <span>{props.leftIcon}</span>
                {props.text}
                <span className="dropdown__icon_right">{props.rightIcon}</span>
            </a>
        )
    }

    return (
        <div className={"dropdown" + (props.className ? props.className : "")}>
            <a href="#"  onClick={(e) => {setOpen(!open)}} className="dropdown__link flex flex-ai-c">
                {props.text}
            </a>
            {open && 
                (
                    <div className="dropdown__menu" style={{height: menuHeight}} ref={dropdownRef}>

                        { props.dropdowns && 
                            props.dropdowns.map((dropdown, index) => {
                                <CSSTransition in={activeMenu===dropdown.name} unmountOnExit timeout={1000} classNames="dropdown__menu_secondary" onEnter={calcHeight}>
                                    <div>
                                        <DropDownItem leftIcon="👈" text="Back" goToMenu="main" />
                                        { dropdown.items && dropdown.items.map((item, index) => {
                                        
                                            <DropDownItem leftIcon={item.leftIcon} text={item.text} rightIcon={item.rightIcon} />
                                        
                                        })}
                                    </div>
                                </CSSTransition>
                            })
                        }
                        <CSSTransition in={activeMenu==="main"} unmountOnExit timeout={1000} classNames="dropdown__menu_primary" onEnter={calcHeight}>
                            <div>
                                {props.children}
                            </div>
                            
                        </CSSTransition>
                    </div>

                )
            
            }
        </div>
    )
}

export default DropDown;