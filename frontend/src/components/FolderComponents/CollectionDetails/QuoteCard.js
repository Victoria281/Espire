import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Tabs, Tab, TextField } from '@mui/material';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { QUOTES_GROUP, QUOTES_PRIORITY } from '../../../constants/names';

import styles from './styles.module.css';

const QuoteCard = ({ show, quote, onDoubleClick }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'QUOTE',
        item: { quote },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const getColor = (id, index) => {
        const grpColor = ['#d32f2f', '#00796b', '#6a1b9a']
        const priorityColor = ['#c8e6c9', '#ffeb3b', '#ef5350']
        if (id == 1) {
            return { color: grpColor[index - 1] }
        } else {
            return { backgroundColor: priorityColor[index - 1] }
        }
    }

    return (
        <div
            ref={drag}
            className={`${styles.quoteCard} ${isDragging ? styles.dragging : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1, width: show!=undefined? '29%': '80%' }}
            onDoubleClick={onDoubleClick}
        >
            <div className={styles.tagContainer}>
                <p className={styles.quoteTag} style={getColor(0, quote.priority)}>
                    {QUOTES_PRIORITY[quote.priority]}
                </p>
                <p className={styles.quoteGrpTag} style={getColor(1, quote.grp_num)}>
                    {QUOTES_GROUP[quote.grp_num]}
                </p>
            </div>
            <p className={styles.quoteInfo}>
                {quote.fact}
            </p>
            <p className={styles.articleName}>
                {quote.articleName}
            </p>
        </div>
    );
};



export default QuoteCard;