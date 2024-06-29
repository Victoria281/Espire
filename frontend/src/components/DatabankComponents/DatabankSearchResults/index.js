import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles.module.css'
import ArticleCollection from "../../ArticleComponents/ArticleCollection";
import SearchWebResults from "../../ArticleComponents/SearchWebResults";

const DatabankSearchResults = ({ results }) => {


    console.log(results)
    return (
        <div>
            {results.database.map((item, index) =>
                <div key={`${index}db`}>
                    <ArticleCollection search={true} articles={results.database} />
                </div>
            )}

            <div className={styles.webSearchName}>Web Search Results</div>
            <SearchWebResults web_results={results.web} />
        </div>
    );
}

export default DatabankSearchResults;
