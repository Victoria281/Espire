import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { saveSynthesis } from '../../../store/actions/articles';
import QuoteCard from './QuoteCard';
import Tabs from './Tabs';
import styles from './styles.module.css';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QUOTES_GROUP } from '../../../constants/names';
import FolderIcon from '@mui/icons-material/Folder';
import { useSelector, useDispatch } from 'react-redux'
import { Subscript } from '@mui/icons-material';

const CollectionDetails = ({ collection }) => {
    const [selectedMTab, setSelectedMTab] = useState("Synthesize");
    const [selectedTab, setSelectedTab] = useState("Important");
    const [isRowLayout, setIsRowLayout] = useState(true);
    const [leftColumn, setLeftColumn] = useState([]);
    const [rightColumn, setRightColumn] = useState([]);
    const [synthesis, setSynthesis] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    const dispatch = useDispatch();
    const mainTabList = ["Synthesize", "View All Quotes"]
    const tabList = ["Important", "Fun Fact", "Extra", "All Synthesis"]

    const toggleLayout = () => {
        setIsRowLayout(!isRowLayout);
    };

    const findQuoteById = (id) => {
        console.log(id)
        for (let article of collection.Articles) {
            for (let quote of article.Quotes) {
                if (quote.id == id) {
                    return quote;
                }
            }
        }
        return null;
    };

    const moveQuote = (quote, column) => {
        if (column === 'left') {
            setLeftColumn((prev) => [...prev, quote]);
        } else {
            setRightColumn((prev) => [...prev, quote]);
        }
        checkForArticleMatch(quote.articleName);
        updateSynthesis();
    };

    const removeQuote = (quote, column) => {
        if (column === 'left') {
            setLeftColumn((prev) => prev.filter((q) => q.id !== quote.id));
        } else {
            setRightColumn((prev) => prev.filter((q) => q.id !== quote.id));
        }
        checkForArticleMatch(quote.articleName);
        updateSynthesis();
    };

    const checkForArticleMatch = (articleName) => {
        const leftArticleNames = leftColumn.map(quote => quote.articleName);
        const rightArticleNames = rightColumn.map(quote => quote.articleName);

        if (leftArticleNames.includes(articleName) && rightArticleNames.includes(articleName)) {
            setMessage(`Article "${articleName}" is in both columns.`);
            setShowMessage(true);
        } else {
            setShowMessage(false);
        }
    };

    const updateSynthesis = useCallback(() => {
        if (leftColumn.length > 0 && rightColumn.length > 0) {
            const synthesisKey = `${leftColumn.map(q => q.id).join(',')}-${rightColumn.map(q => q.id).join(',')}`;
            const savedSynthesisEntry = collection.Synthesis.find(s => s.key === synthesisKey);
            if (savedSynthesisEntry) {
                setSynthesis(savedSynthesisEntry.text);
            } else {
                setSynthesis('');
            }
        } else {
            setSynthesis('');
        }
    }, [leftColumn, rightColumn, collection.Synthesis]);

    const handleSaveSynthesis = () => {
        const synthesisKey = `${leftColumn.map(q => q.id).join(',')}-${rightColumn.map(q => q.id).join(',')}`;
        const existingIndex = collection.Synthesis.findIndex(s => s.key === synthesisKey);

        if (existingIndex !== -1) {
            collection.Synthesis[existingIndex].text = synthesis;
        } else {
            dispatch(saveSynthesis({ collectionid: collection.ID, key: synthesisKey, text: synthesis }));
        }
        console.log('Synthesis saved:', synthesis);
    };

    const handleDragOut = (quote, column) => {
        removeQuote(quote, column);
        if (leftColumn.length === 0 && rightColumn.length === 0) {
            setSynthesis('');
        }
    };

    const allQuotes = collection.Articles?.flatMap(article => article.Quotes.map(quote => ({
        ...quote,
        articleName: article.name,
    }))) || [];

    const [{ isOverLeft }, dropLeft] = useDrop({
        accept: 'QUOTE',
        drop: (item) => moveQuote(item.quote, 'left'),
        collect: (monitor) => ({
            isOverLeft: !!monitor.isOver(),
        }),
    });

    const [{ isOverRight }, dropRight] = useDrop({
        accept: 'QUOTE',
        drop: (item) => moveQuote(item.quote, 'right'),
        collect: (monitor) => ({
            isOverRight: !!monitor.isOver(),
        }),
    });

    const handleMainTabChange = (name) => {
        setSelectedMTab(name);
    }

    const handleTabChange = (name) => {
        setSelectedTab(name);
    }

    useEffect(() => {
        updateSynthesis();
    }, [leftColumn, rightColumn, updateSynthesis]);

    return (
        <DndProvider backend={HTML5Backend}>
            <Box className={styles.contentArea}>
                <div className={styles.title}>
                    <FolderIcon />
                    <p>{collection.name}</p>
                </div>
                <Tabs tablist={mainTabList} selectedTab={selectedMTab} handleChange={handleMainTabChange} />
                {selectedMTab === mainTabList[0] ? (
                    <>
                        <Box className={styles.rowLayout}>
                            <Box
                                ref={dropLeft}
                                className={`${styles.diyColumn} ${isOverLeft ? styles.highlight : ''}`}
                            >
                                {leftColumn.map((quote) => (
                                    <QuoteCard
                                        key={quote.id}
                                        quote={quote}
                                        onDoubleClick={() => handleDragOut(quote, 'left')}
                                    />
                                ))}
                            </Box>
                            <Box
                                ref={dropRight}
                                className={`${styles.diyColumn} ${isOverRight ? styles.highlight : ''}`}
                            >
                                {rightColumn.map((quote) => (
                                    <QuoteCard
                                        key={quote.id}
                                        quote={quote}
                                        onDoubleClick={() => handleDragOut(quote, 'right')}
                                    />
                                ))}
                            </Box>
                            <Box className={styles.synthesisColumn}>
                                {showMessage && (
                                    <Typography variant="body2" color="error">
                                        {message}
                                    </Typography>
                                )}
                                <TextField
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    placeholder="Write your synthesis here..."
                                    value={synthesis}
                                    onChange={(e) => setSynthesis(e.target.value)}
                                    className={styles.synthesisTextArea}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveSynthesis}
                                    className={styles.saveButton}
                                >
                                    Save Synthesis
                                </Button>
                            </Box>
                        </Box>
                        <Box className={styles.quotesArea}>
                            <p>All Quotes <span>Drag and drop quotes into the 2 columns and create your connections! Double click them to remove from the column</span></p>
                            <Box className={styles.quotesList}>
                                {allQuotes.map((quote) => (
                                    <QuoteCard
                                        show={true}
                                        key={quote.id}
                                        quote={quote}
                                        onDoubleClick={() => moveQuote(quote, 'left')}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </>
                ) : (
                    <Box>
                        <Tabs tablist={tabList} selectedTab={selectedTab} handleChange={handleTabChange} />
                        {selectedTab === tabList[3] ? (
                            <div className={styles.synthesisSection}>
                                {collection.Synthesis.map((item, index) => {
                                    let leftids = item.key.split("-")[0].split(",")
                                    let rightids = item.key.split("-")[1].split(",")

                                    return (
                                        <div className={styles.synthesisContent}>
                                            <div className={styles.columnInfo}>
                                                <div className={styles.column}>
                                                    <Typography variant="subtitle1" className={styles.columnTitle}>Left Column</Typography>
                                                    {leftids.length > 0 ? (
                                                        <ul className={styles.columnList}>
                                                            {leftids.map((id) => {
                                                                const quote = findQuoteById(id);
                                                                return quote ? (
                                                                    <li key={id} className={styles.columnItem}>
                                                                        <QuoteCard
                                                                            key={quote.id}
                                                                            quote={quote}
                                                                            onDoubleClick={() => moveQuote(quote, 'left')}
                                                                        />
                                                                    </li>
                                                                ) : (
                                                                    <li key={id} className={styles.columnItem}>
                                                                        <Typography variant="body2" className={styles.quoteArticle}>{id}</Typography>
                                                                        <Typography variant="body2" className={styles.quoteText}>{id}</Typography>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary">No quotes in the left column.</Typography>
                                                    )}
                                                </div>
                                                <div className={styles.column}>
                                                    <Typography variant="subtitle1" className={styles.columnTitle}>Right Column</Typography>
                                                    {rightids.length > 0 ? (
                                                        <ul className={styles.columnList}>
                                                            {rightids.map((id) => {
                                                                const quote = findQuoteById(id);
                                                                return quote ? (
                                                                    <li key={id} className={styles.columnItem}>
                                                                        <QuoteCard
                                                                            key={quote.id}
                                                                            quote={quote}
                                                                            onDoubleClick={() => moveQuote(quote, 'right')}
                                                                        />
                                                                    </li>
                                                                ) : (
                                                                    <li key={id} className={styles.columnItem}>
                                                                        <Typography variant="body2" className={styles.quoteArticle}>{id}</Typography>
                                                                        <Typography variant="body2" className={styles.quoteText}>{id}</Typography>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    ) : (
                                                        <Typography variant="body2" color="textSecondary">No quotes in the right column.</Typography>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={styles.synthesisDetails}>
                                                {item.text}
                                            </div>
                                        </div>

                                    )

                                }

                                )}
                            </div>
                        )
                            : (
                                ['Important', 'Fun Fact', 'Extra'].map((group) => (
                                    <Box key={group} className={styles.groupSection}>
                                        {selectedTab === group && (
                                            <>
                                                <Typography variant="h6">{group} Quotes</Typography>
                                                <Box className={styles.quotesList}>
                                                    {allQuotes.filter(quote => QUOTES_GROUP[quote.grp_num] === group).map((quote) => (
                                                        <QuoteCard
                                                            key={quote.id}
                                                            quote={quote}
                                                            onDoubleClick={() => moveQuote(quote, 'left')}
                                                        />
                                                    ))}
                                                </Box>
                                            </>
                                        )}
                                    </Box>
                                ))
                            )}
                    </Box>

                )}
            </Box>
        </DndProvider>
    );
};




export default CollectionDetails;
