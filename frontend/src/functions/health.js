import { getEspireAPI } from '../controller/userController';

export const checkHealthFn = () => {
    console.log('Checking backend ...');
    return getEspireAPI();
}