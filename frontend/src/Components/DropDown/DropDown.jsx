import "./DropDown.css";
import "../../index.css"
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";



function DropDown(props) {

    const [activeMenu, setActiveMenu] = useState("main")
    const [menuHeight, setMenuHeight] = useState(null);
    

    const dropdownRef = useRef(null);
    useEffect(() => {
        setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    }, [])

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }


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
        <>
    
            <div ref={dropdownRef} className={"dropdown"} style={{height: menuHeight}}>

                { props.dropdowns && 
                    props.dropdowns.map((dropdown, index) => {
                        return (<CSSTransition in={activeMenu===dropdown.name} unmountOnExit timeout={300} classNames="dropdown__menu_secondary" onEnter={calcHeight}>
                            <div>
                                <DropDownItem leftIcon="👈" text="Back" goToMenu="main" />
                                { dropdown.items && dropdown.items.map((item, index) => {
                                
                                    return (<DropDownItem leftIcon={item.leftIcon} text={item.text} rightIcon={item.rightIcon} />);
                                
                                })}
                            </div>
                        </CSSTransition>);
                    })
                }
                <CSSTransition in={activeMenu==="main"} unmountOnExit timeout={300} classNames="dropdown__menu_primary" onEnter={calcHeight}>
                    <div>
                        {
                            props.main.map((item, index) => {
                                console.log(item);
                                return (<DropDownItem leftIcon={item.leftIcon} text={item.text} rightIcon={item.rightIcon} goToMenu={item.goToMenu} />);
                            })
                        }
                    </div>
                </CSSTransition>
            </div>

                
        </>
        
    )
}

export default DropDown;