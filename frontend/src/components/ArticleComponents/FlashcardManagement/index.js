import React, { useState } from 'react';
import { Box, Button, TextField, Chip, Typography, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Delete as DeleteIcon, Flip as FlipIcon } from '@mui/icons-material';
import styles from './styles.module.css';

const FlashcardManagement = ({ flashcards, setFlashcards }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleAddFlashcard = () => {
        setFlashcards([...flashcards, { question: "", answer: "" }]);
    };

    const handleDeleteFlashcard = (index) => {
        setFlashcards(flashcards.filter((_, i) => i !== index));
    };

    const handleFlashcardClick = (flashcard) => {
        setSelectedFlashcard(flashcard);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedFlashcard(null);
    };

    return (
        <Box className={styles.flashcardManagementContainer}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditMode(!isEditMode)}
                startIcon={isEditMode ? <FlipIcon /> : <FlipIcon />}
                sx={{ mb: 2 }}
            >
                {isEditMode ? 'View Mode' : 'Edit Mode'}
            </Button>

            {isEditMode ? (
                <>
                    <Box className={styles.editModeContainer}>
                        {flashcards.map((flashcard, index) => (
                            <Box
                                key={index}
                                className={styles.flashcardEditContainer}
                            >
                                <Box className={styles.flashcardCard}>
                                    <TextField
                                        fullWidth
                                        value={flashcard.question}
                                        onChange={(e) => {
                                            const newFlashcards = [...flashcards];
                                            newFlashcards[index].question = e.target.value;
                                            setFlashcards(newFlashcards);
                                        }}
                                        placeholder="Question"
                                        className={styles.flashcardInput}
                                    />
                                    <TextField
                                        fullWidth
                                        value={flashcard.answer}
                                        onChange={(e) => {
                                            const newFlashcards = [...flashcards];
                                            newFlashcards[index].answer = e.target.value;
                                            setFlashcards(newFlashcards);
                                        }}
                                        placeholder="Answer"
                                        className={styles.flashcardInput}
                                    />
                                    <IconButton
                                        onClick={() => handleDeleteFlashcard(index)}
                                        className={styles.deleteButton}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleAddFlashcard}
                            sx={{ mt: 2 }}
                        >
                            Add New Flashcard
                        </Button>
                    </Box>
                </>
            ) : (
                <Box className={styles.viewModeContainer}>
                    {flashcards.map((flashcard, index) => (
                        <Chip
                            key={index}
                            label={flashcard.question}
                            onClick={() => handleFlashcardClick(flashcard)}
                            className={styles.viewModeChip}
                        />
                    ))}
                </Box>
            )}

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Flashcard</DialogTitle>
                <DialogContent>
                    <Box className={styles.flashcardDialogContent}>
                        <Typography variant="h6">Question:</Typography>
                        <Typography>{selectedFlashcard?.question}</Typography>
                        <Typography variant="h6" mt={2}>Answer:</Typography>
                        <Typography>{selectedFlashcard?.answer}</Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default FlashcardManagement;
