import React from "react";
import { Link } from "react-router-dom";
import styles from './styles.module.css'

const NavItem = ({ index, name, linkTo, disabled }) => {
    return (
        <div  className={styles[`navIcon${disabled ? '-atpage' : ''}`]} >
            <Link key={index} to={disabled ? "#" : linkTo}>
                {name}
            </Link>
        </div>
    );
}

export default NavItem;