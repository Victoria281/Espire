import React, { useState } from 'react';
import { Box, Button, TextField, Chip, Typography, Autocomplete } from '@mui/material';
import styles from './styles.module.css';

const TagManagement = ({ edit, tags, tagInfo, setTagsInfo }) => {
    const [autocompleteOptions, setAutocompleteOptions] = useState(tags.map(tag => tag.name));
    const [newTag, setNewTag] = useState("");


    const handleTagAdd = (tagname) => {
        if (tagname) {
            if (!tagInfo.some(t => t.name === tagname)) {
                setTagsInfo([...tagInfo, { name: tagname }]);
            }
            setNewTag("")
        }
    }

    const handleTagRemove = (tagname) => {
        setTagsInfo(tagInfo.filter(t => t.name !== tagname));
    };

    return (
        <Box className={edit ? styles.tagManagementContainerEdit : styles.tagManagementContainer}>
            {(tagInfo && edit) ?
                <>
                    <div className={styles.tagsTopContainer}>
                        <Autocomplete
                            freeSolo
                            options={autocompleteOptions}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder='Add or select tags'
                                    variant="outlined"
                                    onChange={(e) => setNewTag(e.target.value)}
                                    value={newTag}
                                    className={styles.tagsInput}
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: {
                                            padding: 0,
                                            '& .MuiOutlinedInput-input': {
                                                padding: '4px',
                                                fontSize: '13px',
                                            },
                                        },
                                    }}
                                    sx={{
                                        mb: 0,
                                        '& .MuiInputBase-root': {
                                            padding: '4px 4px',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            fontSize: '12px', // Set font size for the input
                                        },
                                    }}
                                />
                            )}
                            onInputChange={(event, value) => {
                                setNewTag(value);
                            }}
                            onChange={(event, value) => {
                                handleTagAdd(value);
                            }}
                            sx={{ width: '70%', mb: 0 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleTagAdd(newTag)}
                            sx={{ width: "20%", borderRadius: 1, px: 0.4, py: 0.6, fontSize: "12px" }}
                        >
                            Add Tag
                        </Button>
                    </div>
                    <div className={styles.tagsContainer}>
                        {tagInfo.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag.name}
                                onDelete={() => handleTagRemove(tag.name)}
                                className={styles.tagChip}
                                sx={{
                                    '& .MuiChip-deleteIcon': {
                                        color: '#437FC7',
                                    },
                                }}
                            />
                        ))}
                    </div>

                </>
                :

                <div className={styles.tagsDisplayContainer}>
                    {tagInfo!=undefined && tagInfo.length > 0 ? (
                        tagInfo.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag.name}
                                className={styles.tagChip}
                                sx={{
                                    '& .MuiChip-deleteIcon': {
                                        display: 'none', // Hide delete icon
                                    },
                                }}
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No tags available
                        </Typography>
                    )}
                </div>

            }

        </Box>
    );
};

export default TagManagement;
