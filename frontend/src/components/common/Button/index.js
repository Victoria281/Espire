import React from "react";
import styles from './styles.module.css'
import { buttonTypes } from '../../../constants/buttonComponent';
import { ThemeColours } from '../../../constants/theme';

const Button = ({ type, onClick, disabled, children, width }) => {

    const getButtonStyles = () => {
        let fontColor = buttonTypes()[type].fontColor
        let color = buttonTypes()[type].color

        return {
            color: fontColor ? fontColor : 'white',
            backgroundColor: color ? color : ThemeColours().theme_dark,
            width: width ? width : '100%'
        }
    }

    return (
        <div
            onClick={() => { onClick && onClick() }}
            style={getButtonStyles()}
            className={styles[disabled ? 'buttonContainer' : 'buttonContainerPressable']}>
            {children}
        </div>
    );
}

export default Button;