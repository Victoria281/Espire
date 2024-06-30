import React, { useState, useRef, useEffect } from "react";
import NavItem from './NavItem';
import Logo from './Logo';
import styles from './styles.module.css'
import { NAVBAR_ITEMS, NAVBAR_BTNS } from '../../../constants/names'
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { clear_store } from "../../../store/actions/user";

const Navbar = () => {
    const token = useSelector(state => state.user.token)
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    

    const handleClick = (pathname) => {
        navigate(pathname)
    }

    const handleDisabled = (name) => {
        return location.pathname.split('/').slice(0, 2).join('/') == name
    }

    const isAtArticles = () => {
        return location.pathname.split('/').slice(0, 2).join('/') == "/articles"
    }

    const isAtPost = () => {
        return location.pathname.split('/').slice(0, 2).join('/') == "/post"
    }

    const handleEditClick = () => {
        const aid = location.pathname.split('/').slice(2, 4).join('/');
        navigate(`/manpost/${aid}`)
    }

    const handleLogout = () => {
        dispatch(clear_store())
        navigate(`/`)
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
                {isAtArticles() && !isAtPost() &&
                    <Button type="main" onClick={() => handleEditClick()}>
                        Edit
                    </Button>
                }
                {!isAtArticles() && !isAtPost() &&
                    NAVBAR_BTNS(token == undefined).map((item, index) =>
                        <Button key={index} type="main" onClick={() => handleClick(item.link)}>
                            {item.name}
                        </Button>
                    )
                }
                {!(token == undefined) &&
                    <Button type="main" onClick={() => handleLogout()}>
                        Logout
                    </Button>
                }
            </div>
        </div>
    );
}

export default Navbar;