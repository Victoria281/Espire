import React, { useEffect, useState } from "react";
import styles from './styles.module.css'
import { QUOTES_GROUP, QUOTES_PRIORITY } from "../../../constants/names"

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
            "grp_num": 1,
            "priority": 1,
            "fact": ""
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

        <div className={edit ? styles.quoteManagementContainerEdit : styles.quoteManagementContainer}>
            {
                quoteInfo!=undefined && quoteInfo.map((item, index) =>
                    edit ?
                        <div key={index}>
                            <div className={styles.quoteGrpSet}>
                                {Object.entries(QUOTES_GROUP).map(([grpKey, grpLabel]) =>
                                    grpKey == item.grp_num ?
                                        <p className={styles.quoteSelected} key={grpKey}>
                                            {grpLabel}
                                        </p>
                                        :
                                        <p key={grpKey} onClick={() => handleInfoGrpSelect(index, grpKey)}>
                                            {grpLabel}
                                        </p>
                                )}
                            </div>
                            <div className={styles.quotePrioritySet}>
                                {Object.entries(QUOTES_PRIORITY).map(([priorityKey, priorityLabel]) =>
                                    priorityKey == item.priority ?
                                        <p className={styles.quoteSelected} key={priorityKey}>
                                            {priorityLabel}
                                        </p>
                                        :
                                        <p key={priorityKey} onClick={() => handlePrioritySelect(index, priorityKey)}>
                                            {priorityLabel}
                                        </p>
                                )}
                            </div>
                            <textarea
                                type="text"
                                defaultValue={item.fact}
                                onChange={(e) => handleInputChange(e, index)}
                                className={styles.quoteInformationEdit} />
                        </div>

                        :
                        <div key={index}>
                            <div className={styles.quoteInformationDescription}>
                                <p>{QUOTES_GROUP[item.grp_num]}</p>
                                <p>{QUOTES_PRIORITY[item.priority]}</p>
                            </div>
                            <p className={styles.quoteInformation}>{item.fact}</p>
                        </div>
                )
            }
            {
                edit && <button onClick={() => handleAddNew()}>Add New Stats</button>
            }

        </div>
    );
}

export default QuoteManagement;