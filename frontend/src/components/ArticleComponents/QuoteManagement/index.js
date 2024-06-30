import React from 'react';
import { Button, Box, Typography, TextField, MenuItem } from '@mui/material';
import styles from './styles.module.css';
import { QUOTES_GROUP, QUOTES_PRIORITY } from '../../../constants/names';

const QuoteManagement = ({ edit, quoteInfo, setQuoteInfo }) => {
    const handlePrioritySelect = (id, priority) => {
        const updatedQuoteInfo = quoteInfo.map((item, index) =>
            index === id ? { ...item, priority: parseInt(priority) } : item
        );
        setQuoteInfo(updatedQuoteInfo);
    };

    const handleInfoGrpSelect = (id, grp_num) => {
        const updatedQuoteInfo = quoteInfo.map((item, index) =>
            index === id ? { ...item, grp_num: parseInt(grp_num) } : item
        );
        setQuoteInfo(updatedQuoteInfo);
    };

    const handleAddNew = () => {
        const newQuote = {
            grp_num: 1,
            priority: 1,
            fact: ''
        };
        setQuoteInfo([...quoteInfo, newQuote]);
    };

    const handleInputChange = (e, index) => {
        const updatedQuoteInfo = quoteInfo.map((item, idx) =>
            idx === index ? { ...item, fact: e.target.value } : item
        );
        setQuoteInfo(updatedQuoteInfo);
    };

    return (
        <Box className={edit ? styles.quoteManagementContainerEdit : styles.quoteManagementContainer}>
            {quoteInfo && quoteInfo.map((item, index) =>
                edit ? (
                    <Box key={index} className={styles.quoteItem}>
                        <Box className={styles.quoteControls}>
                            <TextField
                                select
                                value={item.grp_num}
                                onChange={(e) => handleInfoGrpSelect(index, e.target.value)}
                                variant="outlined"
                                size="small"
                                className={styles.selectField}
                                sx={{
                                    '.MuiSelect-select': {
                                        fontSize: '15px',
                                        padding: '8px 10px'
                                    }
                                }}
                            >
                                {Object.entries(QUOTES_GROUP).map(([grpKey, grpLabel]) => (
                                    <MenuItem key={grpKey} value={grpKey}>
                                        {grpLabel}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Priority"
                                value={item.priority}
                                onChange={(e) => handlePrioritySelect(index, e.target.value)}
                                variant="outlined"
                                size="small"
                                className={styles.selectField}
                                sx={{
                                    '.MuiSelect-select': {
                                        fontSize: '15px',
                                        padding: '8px 10px'
                                    }
                                }}
                            >
                                {Object.entries(QUOTES_PRIORITY).map(([priorityKey, priorityLabel]) => (
                                    <MenuItem key={priorityKey} value={priorityKey}>
                                        {priorityLabel}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <TextField
                            variant="outlined"
                            multiline
                            rows={2}
                            value={item.fact}
                            onChange={(e) => handleInputChange(e, index)}
                            className={styles.textarea}
                            sx={{
                                '& .MuiInputBase-root': {
                                    padding: "10px 10px",
                                },
                                '& .MuiOutlinedInput-root': {
                                    padding: "10px 10px",
                                },
                            }}
                        />
                        <div className={styles.divider}></div>
                    </Box>
                ) : (
                    <Box key={index} className={styles.quoteDisplay}>
                        <Typography variant="body1" className={styles.quoteGroup}>
                            {QUOTES_GROUP[item.grp_num]}
                        </Typography>
                        <Typography variant="body2" className={styles.quotePriority}>
                            {QUOTES_PRIORITY[item.priority]}
                        </Typography>
                        <Typography variant="body2" className={styles.quoteFact}>
                            {item.fact}
                        </Typography>
                        <div className={styles.divider}></div>
                    </Box>
                )
            )}
            {edit && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddNew}
                    className={styles.addButton}
                >
                    Add New Quote
                </Button>
            )}
        </Box>
    );
};

export default QuoteManagement;
