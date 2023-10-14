import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button/Button";
import "./SideBar.css";
import "../../index.css";
import useAuth from "../../hooks/useAuth";
import axiosWithAuth from "../../api/axios";
import Alert from "../Alert/Alert";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";



function SideBar() {

    const [collapsed, setCollapsed] = useState(true);
    const sidebarRef = useRef(null);

    const {auth, setAuth} = useAuth();

    const [errMsg, setErrMsg] = useState("");
    const [flag, setFlag] = useState(false);
    const errRef = useRef(null);

    const handleLogout = async () => {
        try {
            const response =  await axiosWithAuth.post("/auth/logout", {
                Headers: {x_access_token: auth.token}
            });
            setAuth({token: null, user: null});
        } catch (err) {
            setFlag(true);
            setErrMsg("An error occurred while logging out. Please try again later.");
        }
        

    
    }

    return (
            <div>
                <div className={"sidebar " + (collapsed ? "sidebar_collapsed-exit" : "sidebar_collapsed-enter")} ref={sidebarRef}>
                    <div className={"sidebar__header " + (collapsed ? "grid grid-center" : "flex flex-ai-c flex-jc-sb")}>
                        {!collapsed && <h1>Hallo</h1>}
                        {collapsed ? <FontAwesomeIcon icon={faBars} onClick={() => setCollapsed(!collapsed)} /> : <FontAwesomeIcon icon={faX} onClick={() => setCollapsed(!collapsed)} />}
                    </div>

                    {!collapsed &&
                        <div className="sidebar__links flex flex-col flex-ai-c flex-jc-c">
                            <a href="#">Home</a>
                            <a href="#">About</a>
                            <a href="#">Projects</a>
                            <a href="#">Contact</a>
                        </div>
                    }

                    {!collapsed &&
                        <div className="sidebar__footer">

                            <Button onClick={()=>{handleLogout()}}>Logout</Button>
                            <p>© 2021</p>

                        </div>    
                    }


                
                </div>
                <div className="flex flex-jc-c">
                    <div className={"sidebar__alert_container " + (collapsed ? "sidebar__alert_container_exit" : "sidebar__alert_container_enter")}>
                        <Alert  className="sidebar__alert" error={true} show={flag} reference={errRef} style={{width: "100%"}}>
                            <div className='flex flex-ai-c flex-jc-sb'>
                                <span> <FontAwesomeIcon icon={faExclamationCircle}/> </span>
                                {errMsg}
                                <span className="closebtn" onClick={()=>{setFlag(false)}}>&times;</span> 
                            </div>
                        </Alert>
                    </div>
                </div>
            </div>
        )

}

export default SideBar;