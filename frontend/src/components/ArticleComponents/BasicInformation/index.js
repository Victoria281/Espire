import { useState } from "react";
import styles from './styles.module.css';
import { BASIC_INFO_CONTENT_P1, LINK_NAME, LINKS_NAME, BASIC_INFO_CONTENT_P2 } from "../../../constants/names";
import { TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; // MUI Add icon
import DeleteIcon from '@mui/icons-material/Delete'; // MUI Delete icon

const BasicInformation = ({ editedInfo, setEditedInfo, edit }) => {

    const handleInputChange = (e, tag) => {
        setEditedInfo({ ...editedInfo, [tag]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // setEditMode(false); // Exit edit mode after submission
    }

    const addNewLinkField = () => {
        setEditedInfo(prevState => ({
            ...prevState,
            Links: [
                ...prevState.Links,
                { link: '', is_main: false }
            ]
        }));
    }

    const removeLinkField = (index) => {
        const updatedLinks = editedInfo.Links.filter((_, ind) => ind !== index);
        setEditedInfo({ ...editedInfo, Links: updatedLinks });
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            timeZone: 'Asia/Singapore',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const formatString = (title, data) => {
        return title === "date" ? formatTimestamp(data) : data;
    }

    const formattedDate = new Date(editedInfo[BASIC_INFO_CONTENT_P1[2].tag]).toISOString().split('T')[0];

    return (
        <div className={styles.basicInformationContainer}>
            <div className={styles.basicInformationTop}>
                {
                    BASIC_INFO_CONTENT_P1.slice(0, 2).map((item, index) =>
                        <div key={index}>
                            <p>{item.name}</p>
                            {edit ? (
                                <input
                                    className={styles.linkContainer}
                                    type="text"
                                    value={editedInfo[item.tag]}
                                    onChange={(e) => handleInputChange(e, item.tag)}
                                />
                            ) : (
                                <p className={styles.infoContainer}>{formatString(item.tag, editedInfo[item.tag])}</p>
                            )}
                        </div>
                    )
                }
                <div className={styles.dateContainer}>
                    <p>{BASIC_INFO_CONTENT_P1[2].name}</p>
                    {edit ? (
                        <TextField
                            variant="outlined"
                            fullWidth
                            type="date"
                            value={formattedDate}
                            onChange={(e) => handleInputChange(e, BASIC_INFO_CONTENT_P1[2].tag)}
                        />
                    ) : (
                        <p className={styles.infoContainer}>{formatString(BASIC_INFO_CONTENT_P1[2].tag, editedInfo[BASIC_INFO_CONTENT_P1[2].tag])}</p>
                    )}
                </div>
                <div>
                    <p>{LINK_NAME}</p>
                    <div>
                        {editedInfo.Links?.map((linkItem, ind) => {
                            if (linkItem.is_main) {
                                if (edit) {
                                    return (
                                        <input
                                            className={styles.linkEdit}
                                            key={ind}
                                            type="text"
                                            value={linkItem.link}
                                            onChange={(e) => {
                                                const updatedLinks = [...editedInfo.Links];
                                                updatedLinks[ind].link = e.target.value;
                                                setEditedInfo({ ...editedInfo, Links: updatedLinks });
                                            }}
                                        />
                                    );
                                } else {
                                    return (
                                        <a key={ind} className={styles.linkContainer}>
                                            {linkItem.link}
                                        </a>
                                    );
                                }
                            }
                            return null;
                        })}
                    </div>
                </div>
                <div>
                    <p>{LINKS_NAME}</p>
                    <div className={styles.linkBoxContainer}>
                        {editedInfo.Links?.map((linkItem, ind) => {
                            if (!linkItem.is_main) {
                                return (
                                    <div key={ind} className={styles.linkItem}>
                                        {edit ? (
                                            <input
                                                className={styles.linkItemContainer}
                                                type="text"
                                                value={linkItem.link}
                                                onChange={(e) => {
                                                    const updatedLinks = [...editedInfo.Links];
                                                    updatedLinks[ind].link = e.target.value;
                                                    setEditedInfo({ ...editedInfo, Links: updatedLinks });
                                                }}
                                            />
                                        ) : (
                                            <a className={styles.linkItemContainer}>
                                                {linkItem.link}
                                            </a>
                                        )}
                                        {edit && (
                                            <IconButton
                                                className={styles.removeIcon}
                                                onClick={() => removeLinkField(ind)}
                                                aria-label="remove link"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })}
                        {edit && (
                            <IconButton
                                className={styles.addIcon}
                                onClick={addNewLinkField}
                                aria-label="add link"
                            >
                                <AddIcon />
                            </IconButton>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.basicInformationBottom}>
                {
                    BASIC_INFO_CONTENT_P2.map((item, index) =>
                        <div key={index}>
                            <p>{item.name}</p>
                            {edit ? (
                                <textarea
                                    type="text"
                                    value={editedInfo[item.tag]}
                                    onChange={(e) => handleInputChange(e, item.tag)}
                                />
                            ) : (
                                <p className={styles.infoContainer}>{editedInfo[item.tag]}</p>
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default BasicInformation;
