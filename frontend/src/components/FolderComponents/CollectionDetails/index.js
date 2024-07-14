import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Tabs, Tab, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faPlus, faArrowsAltH, faArrowsAltV } from '@fortawesome/free-solid-svg-icons';
import ArticleCard from '../ArticleCard';
import FlashcardSection from '../FlashcardSection';
import styles from './styles.module.css';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QUOTES_GROUP } from '../../../constants/names';

const CollectionDetails = ({ collection }) => {
    console.log(collection)
    const [selectedTab, setSelectedTab] = useState('DIY');
    const [isRowLayout, setIsRowLayout] = useState(true);
    const [leftColumn, setLeftColumn] = useState([]);
    const [rightColumn, setRightColumn] = useState([]);
    const [synthesis, setSynthesis] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');


    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const toggleLayout = () => {
        setIsRowLayout(!isRowLayout);
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
            collection.Synthesis.push({ key: synthesisKey, text: synthesis });
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

    useEffect(() => {
        updateSynthesis();
    }, [leftColumn, rightColumn, updateSynthesis]);

    return (
        <DndProvider backend={HTML5Backend}>
            <Box className={styles.container}>
                <header className={styles.header}>
                    <Typography variant="h6" className={styles.logo}>
                        Espire
                    </Typography>
                    <div className={styles.headerActions}>
                        <TextField
                            variant="outlined"
                            size="small"
                            className={styles.searchBar}
                            placeholder="Search..."
                        />
                        <FontAwesomeIcon icon={faUser} className={styles.icon} />
                        <FontAwesomeIcon icon={faCog} className={styles.icon} />
                    </div>
                </header>
                <main className={styles.mainContent}>
                    <div className={styles.sidebarMenu}>
                        <ul>
                            <li className={styles.menuItem}>
                                <FontAwesomeIcon icon={faArrowsAltH} className={styles.icon} />
                                <span>All Articles</span>
                            </li>
                            <li className={`${styles.menuItem} ${styles.selectedMenuItem}`}>
                                <FontAwesomeIcon icon={faArrowsAltV} className={styles.icon} />
                                <span>{collection.name}</span>
                            </li>
                            <li className={styles.menuItem}>
                                <FontAwesomeIcon icon={faPlus} className={styles.icon} />
                                <span>Flashcards</span>
                            </li>
                        </ul>
                    </div>
                    <Box className={styles.contentArea}>
                        <Tabs value={selectedTab} onChange={handleTabChange} className={styles.tabs}>
                            <Tab label="DIY" value="DIY" />
                            <Tab label="All" value="All" />
                        </Tabs>
                        {selectedTab === 'DIY' ? (
                            <Box>
                                <Button onClick={toggleLayout} className={styles.toggleButton}>
                                    {isRowLayout ? (
                                        <FontAwesomeIcon icon={faArrowsAltV} />
                                    ) : (
                                        <FontAwesomeIcon icon={faArrowsAltH} />
                                    )}
                                </Button>
                                <Box className={isRowLayout ? styles.rowLayout : styles.columnLayout}>
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
                                            rows={10}
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
                                    <Typography variant="h6">Available Quotes</Typography>
                                    <Box className={styles.quotesList}>
                                        {allQuotes.map((quote) => (
                                            <QuoteCard
                                                key={quote.id}
                                                quote={quote}
                                                onDoubleClick={() => moveQuote(quote, 'left')}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        ) : (
                            <Box>
                                <Box className={styles.allContent}>
                                    <Tabs value={selectedTab} onChange={handleTabChange} className={styles.tabs}>
                                        <Tab label="Important" value="Important" />
                                        <Tab label="FunFact" value="FunFact" />
                                        <Tab label="Extra" value="Extra" />
                                        <Tab label="Synthesis" value="Synthesis" />
                                    </Tabs>
                                    {selectedTab === 'Synthesis' ? (
                                        <div className={styles.synthesisSection}>
                                            <Typography variant="h6" className={styles.synthesisHeader}>Synthesis</Typography>
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
                                                                        {leftids.map((id) => (
                                                                            <li key={id} className={styles.columnItem}>
                                                                                <div className={styles.quoteCard}>
                                                                                    <Typography variant="body2" className={styles.quoteArticle}>{id}</Typography>
                                                                                    <Typography variant="body2" className={styles.quoteText}>{id}</Typography>
                                                                                </div>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <Typography variant="body2" color="textSecondary">No quotes in the left column.</Typography>
                                                                )}
                                                            </div>
                                                            <div className={styles.column}>
                                                                <Typography variant="subtitle1" className={styles.columnTitle}>Right Column</Typography>
                                                                {rightids.length > 0 ? (
                                                                    <ul className={styles.columnList}>
                                                                        {rightids.map((id) => (
                                                                            <li key={id} className={styles.columnItem}>
                                                                                <div className={styles.quoteCard}>
                                                                                    <Typography variant="body2" className={styles.quoteArticle}>{id}</Typography>
                                                                                    <Typography variant="body2" className={styles.quoteText}>{id}</Typography>
                                                                                </div>
                                                                            </li>
                                                                        ))}
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
                                            ['Important', 'FunFact', 'Extra'].map((group) => (
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
                            </Box>

                        )}
                    </Box>
                </main>
            </Box>
        </DndProvider>
    );
};


const QuoteCard = ({ quote, onDoubleClick }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'QUOTE',
        item: { quote },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className={`${styles.quoteCard} ${isDragging ? styles.dragging : ''}`}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            onDoubleClick={onDoubleClick}
        >
            <div className={styles.quoteContent}>
                <Typography variant="body2">{quote.text}</Typography>
                <Typography variant="caption" color="textSecondary" className={styles.articleName}>
                    {quote.articleName}
                </Typography>
            </div>
            <div className={styles.quoteFooter}>
                <Typography variant="caption" className={styles.quoteFact}>
                    {quote.fact}
                </Typography>
                <div className={styles.priorityGroup}>
                    <Typography variant="caption" className={styles.priority}>
                        Priority: {quote.priority}
                    </Typography>
                    <Typography variant="caption" className={styles.groupNum}>
                        Group: {quote.groupNumber}
                    </Typography>
                </div>
            </div>
        </div>
    );
};



export default CollectionDetails;
