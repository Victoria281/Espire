import React from "react";
import TableRowsIcon from '@mui/icons-material/TableRows';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import styles from './styles.module.css'

const TabSelection = ({ rowView, setRowView }) => {
    return (
        <div className={styles.tabContainer} >
            <div className={styles[`tabItem${rowView ? '-selected' : ''}`]} onClick={() => !rowView && setRowView(true)}>
                <TableRowsIcon />
            </div>
            <div className={styles[`tabItem${rowView ? '' : '-selected'}`]} onClick={() => rowView && setRowView(false)}>
                <ViewColumnIcon />
            </div>
        </div>

    );
}

export default TabSelection;
