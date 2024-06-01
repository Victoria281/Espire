import React from "react";
import styles from './styles.module.css'

const InputComponent = ({ col, setCol, title }) => {
    return (
        <div className={styles.inputComponentsContainer}>
          <input
            value={col}
            onChange={(e) => setCol(e.target.value)}
            placeholder={title}
            className={styles.roundedInput}
            type={title}
          />
        </div>
    );
}

export default InputComponent;
