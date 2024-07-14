// AdminPasswordModal.jsx
import React, { useState } from 'react';
import { CircularProgress, Modal, Button, TextField, Typography } from '@mui/material';
import { bulkPwd } from "../../../constants/bulk";
import styles from './styles.module.css';

const AdminModal = ({ loading, open, onSubmit, setIsOpen }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleClose = (e) => {
        e.stopPropagation();
    };

    const handleSubmit = () => {
        if (password === bulkPwd) {
            onSubmit();
        } else {
            setError('Incorrect password');
        }
    };

    React.useEffect(() => {
        if (open) {
            const handleBeforeUnload = (e) => {
                e.preventDefault();
                e.returnValue = '';
            };
            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className={styles.adminmodal}
        >
            <div className={styles.adminmodalContent}>
                {loading ?
                    <>
                        <CircularProgress
                            size={60}
                            className={styles.adminloader} />
                        <Typography variant="h6" color="textSecondary">
                            Please wait until modal closes
                        </Typography>
                    </>
                    :

                    <>  <Typography variant="h6" className={styles.adminheader}>Admin Password Required</Typography>
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.admintextField}
                            error={!!error}
                            helperText={error}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            className={styles.adminsubmitButton}
                        >
                            Submit
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => setIsOpen(false)}
                            className={styles.admincancelButton}
                        >
                            Close
                        </Button>
                    </>
                }

            </div>
        </Modal>
    );
};

export default AdminModal;
