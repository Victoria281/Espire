import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import styles from './styles.module.css';

const FlashcardSection = () => {
    return (
        <Box className={styles.flashcardSection}>
            <Typography variant="h6" className={styles.flashcardTitle}>
                Flashcards
            </Typography>
            <Box className={styles.flashcardList}>
                {/* Example flashcards */}
                <Box className={styles.flashcard}>
                    <Typography variant="body2" className={styles.flashcardTerm}>
                        Term 1
                    </Typography>
                    <Button variant="outlined" color="primary" className={styles.learnMoreButton}>
                        Learn more
                    </Button>
                </Box>
                <Box className={styles.flashcard}>
                    <Typography variant="body2" className={styles.flashcardTerm}>
                        Term 2
                    </Typography>
                    <Button variant="outlined" color="primary" className={styles.learnMoreButton}>
                        Learn more
                    </Button>
                </Box>
                {/* Add more flashcards as needed */}
            </Box>
        </Box>
    );
};

export default FlashcardSection;
