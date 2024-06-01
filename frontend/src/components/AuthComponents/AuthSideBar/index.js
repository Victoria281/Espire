import React from "react";
import styles from './styles.module.css'
import Button from "@mui/material/Button";

const AuthSideBar = ({ onClick, title, btn }) => {
    return (
        <div className={styles.authSideBarContainer} >
            <p>{title}</p>
            <Button
                type="submit"
                variant="contained"
                onClick={onClick}
                className={styles.authSideBarContainerBtn}
            >
                {btn}
            </Button>
        </div>
    );
}

export default AuthSideBar;
