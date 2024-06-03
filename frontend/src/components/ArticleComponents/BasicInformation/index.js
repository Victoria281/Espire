import { useState } from "react";
import styles from './styles.module.css'
import { BASIC_INFO_CONTENT_P1, LINK_NAME, LINKS_NAME, BASIC_INFO_CONTENT_P2 } from "../../../constants/names"
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

    return (
        <div className={styles.basicInformationContainer} >
            <div className={styles.basicInformationTop} >
                {
                    BASIC_INFO_CONTENT_P1.slice(0,2).map((item, index) =>
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
                                <p>{editedInfo[item.tag]}</p>
                            )}
                        </div>
                    )
                }
                <div>
                    <p>{LINK_NAME}</p>
                    <div>
                        {editedInfo.Links!=undefined && editedInfo.Links.map((linkItem, ind) => {
                            if (linkItem.is_main) {
                                if (edit) {
                                    return <input
                                        key=""
                                        type="text"
                                        value={linkItem.link}
                                        onChange={(e) => {
                                            const updatedLinks = [...editedInfo.Links];
                                            updatedLinks[ind].link = e.target.value;
                                            setEditedInfo({ ...editedInfo, Links: updatedLinks });
                                        }}
                                    />
                                } else {
                                    return <a key="" className={styles.linkContainer}>{linkItem.link}</a>
                                }
                            }
                        })}
                    </div>
                </div>
                <div>
                    <p>{LINKS_NAME}</p>
                    <div
                        className={styles.linkBoxContainer}>
                        {editedInfo.Links!=undefined && editedInfo.Links.map((linkItem, ind) => {
                            if (!linkItem.is_main) {
                                if (edit) {
                                    return <input
                                        key={ind}
                                        className={styles.linkContainer}
                                        type="text"
                                        value={linkItem.link}
                                        onChange={(e) => {
                                            const updatedLinks = [...editedInfo.Links];
                                            updatedLinks[ind].link = e.target.value;
                                            setEditedInfo({ ...editedInfo, Links: updatedLinks });
                                        }}
                                    />
                                } else {
                                    return <a key="" className={styles.linkContainer}>{linkItem.link}</a>
                                }
                            }
                        })}
                        {edit && (
                            <button onClick={addNewLinkField}>Add New Link</button>
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
                                <p>{editedInfo[item.tag]}</p>
                            )}
                        </div>
                    )
                }

            </div>

        </div>
    );
}

export default BasicInformation;
