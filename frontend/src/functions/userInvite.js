import { searchUserAPI, getInvitedUsersAPI, inviteUserAPI, removeUserAPI  } from '../controller/articleController';

export const searchUserFn = async (collectionID, query) => {
    const response = await searchUserAPI(collectionID, query);
    if (response.success) {
        return response.users;
    } else {
        console.error('Failed to search user:', response.error);
        return [];
    }
}

export const getInvitedUsersFn = async (collectionID) => {
    const response = await getInvitedUsersAPI(collectionID);
    if (response.success) {
        console.log('Invited users:', response.users);
        return response.users;
    } else {
        console.error('Failed to get invited users:', response.error);
        return [];
    }
}

export const inviteUserFn = async (collectionID, username) => {
    const response = await inviteUserAPI(collectionID, username);
    if (response.success) {
        console.log('User invited successfully');
    } else {
        console.error('Failed to invite user:', response.error);
    }
}

export const removeUserFn = async (collectionID, username) => {
    const response = await removeUserAPI(collectionID, username);
    if (response.success) {
        console.log('User removed successfully');
    } else {
        console.error('Failed to remove user:', response.error);
    }
}