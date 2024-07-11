import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
// import { ReactComponent as AllArticlesIcon } from '../assets/icons/all-articles.svg';
// import { ReactComponent as ColorPsychologyIcon } from '../assets/icons/color-psychology.svg';
// import { ReactComponent as FlashcardsIcon } from '../assets/icons/flashcards.svg';
import styles from './styles.module.css';

const SidebarMenu = () => {
    return (
        <Box className={styles.sidebar}>
            <List>
                <ListItem button className={styles.selectedMenuItem}>
                    <ListItemIcon>
                        {/* <AllArticlesIcon className={styles.icon} /> */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-book">
                            <path d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13M4 19h16M4 19l1.5-2m-1.5 2L5.5 17m14.5 2L19.5 17 21 19m-1.5-2L19.5 17M19 5v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2z" />
                        </svg>

                    </ListItemIcon>
                    <ListItemText primary="All Articles" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        {/* <ColorPsychologyIcon className={styles.icon} /> */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-palette">
                            <path d="M21 15.5a2.5 2.5 0 0 0-1-1.9c-.6-.6-1.5-1-2.5-1-.8 0-1.7.4-2.5 1-1 1-1 1-1.5 2s0 1 1 1.5c.5.5 1.5 1 2.5 1a2.5 2.5 0 0 0 2.5-2.5zM4 4h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM2 6a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6z" />
                        </svg>

                    </ListItemIcon>
                    <ListItemText primary="Color Psychology" />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        {/* <FlashcardsIcon className={styles.icon} /> */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="feather feather-bookmark">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16z" />
                        </svg>

                    </ListItemIcon>
                    <ListItemText primary="Flashcards" />
                </ListItem>
                {/* Add more items as needed */}
            </List>
        </Box>
    );
};

export default SidebarMenu;
