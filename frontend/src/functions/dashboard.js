import { getUserVisitsAPI, getUserTagsAPI, getSavedArticlesAPI, removeUserTagAPI, addUserTagAPI } from '../controller/userController';

export const retrieveOwnInfo = async () => {
    try {
        console.log('Retrieving User Visit history...');
        const visitsResponse = await getUserVisitsAPI();
        
        console.log('Retrieving User preferred tags...');
        const tagsResponse = await getUserTagsAPI();
        
        console.log('Retrieving User Saved Articles...');
        const savedArticlesResponse = await getSavedArticlesAPI();

        return {
            success: true,
            visits: visitsResponse.data,
            tags: tagsResponse.data,
            savedArticles: savedArticlesResponse.data
        };
    } catch (error) {
        console.error('Error retrieving user information:', error);

        return {
            success: false,
            error: error.message
        };
    }
}

export const removeUserTag = async (tagId) => {
    try {
        const response = await removeUserTagAPI(tagId);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const addUserTag = async (tagId) => {
    try {
        const response = await addUserTagAPI(tagId);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

export const fetchUserTags = async () => {
    try {
        const response = await getUserTagsAPI();
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
