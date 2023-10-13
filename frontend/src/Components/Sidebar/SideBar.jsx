import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import "./SideBar.css";
import "../../index.css"



function SideBar() {

    const [collapsed, setCollapsed] = useState(true);
    const sidebarRef = useRef(null);

    ;

    return (
            
            <div className={"sidebar " + (collapsed ? "sidebar_collapsed-exit" : "sidebar_collapsed-enter")} ref={sidebarRef}>
                <div className={"sidebar__header " + (collapsed ? "grid grid-center" : "flex flex-ai-c flex-jc-sb")}>
                    {!collapsed && <h1>Hallo</h1>}
                    {collapsed ? <FontAwesomeIcon icon={faBars} onClick={() => setCollapsed(!collapsed)} /> : <FontAwesomeIcon icon={faX} onClick={() => setCollapsed(!collapsed)} />}
                </div>
                
            </div>



        )

}

export default SideBar;