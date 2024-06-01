import React from "react";
import { Link } from 'react-router-dom';
import { LOGO_IMAGE_PATH } from '../../../constants/names'
import styles from './styles.module.css'

const Logo = () => {

    return (
        <div className={styles.logo}>
            <Link to="/">
                <img className={styles.logoImg} src={LOGO_IMAGE_PATH} />
            </Link>
        </div>
    );
}

export default Logo;