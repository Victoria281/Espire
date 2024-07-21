import { useEffect, useState } from "react";
import { checkHealthFn } from '../../functions/health';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import styles from "./styles.module.css";

const HealthCheck = () => {
    const [status, setStatus] = useState("Checking...");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            const fetchHealthStatus = async () => {
                const healthStatus = await checkHealthFn();
                setStatus(healthStatus);
            };
            fetchHealthStatus();
        }
    }, [open]);

    const handleOpen = () => {
        setOpen(!open);
    }

    return (
        <div className={styles.healthCheck}>
            <button onClick={handleOpen} className={styles.healthCheckButton}>
                {open ? <KeyboardDoubleArrowRightIcon /> : <KeyboardDoubleArrowLeftIcon />}
            </button>
            <div className={`${styles.healthCheckContent} ${open ? styles.open : ''}`}>
                {open && <p>{status}</p>}
            </div>
        </div>
    );
};

export default HealthCheck;
