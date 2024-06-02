import React, { useState, useRef, useEffect } from "react";
import NavItem from './NavItem';
import Logo from './Logo';
import styles from './styles.module.css'
import { useSelector } from "react-redux";
import { NAVBAR_ITEMS, NAVBAR_BTNS } from '../../../constants/names'
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Button";

const Navbar = () => {
    const token = useSelector(state => state.user.token)
    const navigate = useNavigate();
    const location = useLocation();
    // const redirectToLogout = () => {
    //     AuthService.redirectToLogout()
    // }

    const handleClick = (pathname) => {
        navigate(pathname)
    }

    const handleDisabled = (name) => {
        return location.pathname == name
    }

    return (
        <div className={styles.navbarContainer}>
            <div className={styles.navbarContainerLeft}>
                <Logo />
                {
                    NAVBAR_ITEMS.map((item, index) =>
                        <NavItem key={index} index={index} name={item.name} linkTo={item.link} disabled={handleDisabled(item.link)} />
                    )
                }
            </div>
            <div className={styles.navbarContainerRight}>
                {
                    NAVBAR_BTNS(token == undefined).map((item, index) =>
                        <Button key={index} type="main" onClick={() => handleClick(item.link)}>
                            {item.name}
                        </Button>
                    )
                }
            </div>
        </div>
    );
}

export default Navbar;