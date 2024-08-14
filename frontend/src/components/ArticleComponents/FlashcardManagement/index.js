import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router-dom";

import { Box, Button, TextField, Chip, Typography, IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Delete as DeleteIcon, Flip as FlipIcon } from '@mui/icons-material';
import { generateFlashcards, updateFlashcards, deleteFlashcards } from '../../../store/actions/articles';
import styles from './styles.module.css';

const FlashcardManagement = ({ id, flashcards, setFlashcards }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    const [userAnswer, setUserAnswer] = useState([]);
    const [userAnswerResults, setUserAnswerResults] = useState([]);
    const [score, setScore] = useState(0);

    const [submitted, setSubmitted] = useState(false);

    const handleGenerateFlashcards = async () => {
        await dispatch(generateFlashcards(id)).then((result) => {
            if (result.success) {
                console.log(result.data.flashcards)
                console.log(result.data.flashcards)
                setFlashcards([...flashcards, ...result.data.flashcards]);
            }
        })
    }

    useEffect(() => {
        if (submitted == false) {
            setUserAnswer(flashcards.map(() => ""));
            setUserAnswerResults(flashcards.map(() => false));
        }
    }, [flashcards]);

    const dispatch = useDispatch();

    const handleAddFlashcard = () => {
        setFlashcards([...flashcards, { id: 0, question: "", answer: "", tries: 0, wrong: 0 }]);
        setUserAnswer([...userAnswer, ""]);
        setUserAnswerResults([...userAnswerResults, false]);
    };

    const handleSaveClicked = () => {
        handleSaveFlashcard();
        setIsEditMode(false);
    };

    const handleSaveFlashcard = () => {
        dispatch(updateFlashcards(flashcards, id))
    };

    const handleReTry = () => {
        setSubmitted(false)
    };

    const handleDeleteFlashcard = (index) => {
        setFlashcards(flashcards.filter((_, i) => i !== index));
        if (flashcards[index].id != undefined) {
            dispatch(deleteFlashcards(flashcards[index].id))
        }
        setFlashcards(flashcards.filter((_, i) => i !== index));
        setUserAnswer(userAnswer.filter((_, i) => i !== index));
        setUserAnswerResults(userAnswerResults.filter((_, i) => i !== index));
    };

    const handleSubmitAnswer = () => {
        let nScore = 0;
        const updatedResults = [...userAnswerResults];
        console.log("handleSubmitAnswer")
        const newFlashcards = flashcards.map((flashcard, index) => {
            const userAnswerInput = userAnswer[index].trim().toLowerCase().replace(/\s+/g, '');
            const flashcardAnswer = flashcard.answer.trim().toLowerCase().replace(/\s+/g, '');

            const isCorrect = userAnswerInput === flashcardAnswer;
            const updatedFlashcard = {
                ...flashcard,
                tries: flashcard.tries + 1,
                wrong: isCorrect ? flashcard.wrong : flashcard.wrong + 1,
            };

            updatedResults[index] = isCorrect;
            if (isCorrect) {
                nScore += 1;
            }

            return updatedFlashcard;
        });

        setFlashcards(newFlashcards);
        handleSaveFlashcard();
        setSubmitted(true);
        setScore(nScore)
        setUserAnswerResults(updatedResults)
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
                    <div className={styles.editOptions}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleAddFlashcard}
                            sx={{ mt: 2 }}
                        >
                            Add New Flashcard
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleGenerateFlashcards}
                            sx={{ mt: 2 }}
                        >
                            Generate
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveClicked}
                            sx={{ mt: 2 }}
                        >
                            Save
                        </Button>
                    </div>
                </Box>
            ) : (
                <Box className={styles.viewModeContainer}>
                    {
                        submitted &&
                        <div className={styles.submitArea}>
                            <p>Score: {score}/{flashcards.length}</p>
                            {score / flashcards.length < 0.5 ?
                                <p>Try harder next time!</p>
                                :
                                <p>Good Job!</p>
                            }
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleReTry}
                                sx={{ mt: 2 }}
                            >
                                Try again
                            </Button>
                        </div>
                    }
                    {flashcards.map((flashcard, index) => (
                        <Box key={"flashcard" + index}
                            className={styles[`flashcardItem${submitted ? (userAnswerResults[index] ? "Correct" : "Wrong") : ""}`]}
                        >
                            <Chip
                                label={`Question ${index + 1} : ${flashcard.question}`}
                                className={styles.viewModeChip}
                            />
                            <TextField
                                fullWidth
                                value={userAnswer[index]}
                                onChange={(e) => {
                                    const newUserAnswers = [...userAnswer];
                                    newUserAnswers[index] = e.target.value;
                                    setUserAnswer(newUserAnswers);
                                }}
                                placeholder="Your Answer"
                                className={styles.flashcardAnswer}
                                sx={{ mt: 2 }}
                            />
                        </Box>
                    ))}
                    {flashcards != undefined && flashcards.length > 0 && !submitted &&
                        <Button
                            className={styles.submitBtn}
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitAnswer}
                            sx={{ mt: 2 }}
                        >
                            Submit
                        </Button>}
                </Box>
            )}
        </Box>
    );
};

export default FlashcardManagement;
