import {
    AXIOS_HANDLER_TAG as TAG,
    TIMEOUT,
    UNAUTHORISED,
    GENERAL,
    BUG,
    FORBIDDEN
} from '../constants/error';

const checkError = (err, url) => {
    console.log('\n');
    console.log('!!! Failed to send request to API Endpoint: ' + url);

    if (err.toJSON().message.toLowerCase().includes('network error')) {
        console.log('Error: Timeout exceeded.');
        return TIMEOUT;
    } else {
        try {
            if (err.response) {
                if (err.response.status == 401) {
                    console.log('Error: Unauthorised.');
                    return UNAUTHORISED;
                }
                if (err.response.status == 403) {
                    console.log('Error: Forbidden.');
                    return FORBIDDEN;
                }

                console.log('Error: Here is the response');
                console.log('Data: ' + err.response.data);
                console.log('Message: ' + err.response.data.message);
                console.log('Status: ' + err.response.status);
                console.log('Headers: ' + err.response.headers);
                return GENERAL;
            } else if (err.request) {
                console.log('Error: No response received from the API Endpoint');
                console.log('Request: ' + JSON.stringify(err.request));
                return TIMEOUT;
            } else {
                console.log('Error: Request Failed / ' + JSON.stringify(err.message));
                return TIMEOUT;
            }
        } catch (e) {
            return BUG;
        } finally {
            console.log('Error: ' + JSON.stringify(err.config));
            console.log('Summary: ' + err);
        }
    }
};

export const displayErrorHandler = (err, api_url) => {
    console.log(`\nERROR OCCURED at \ ${api_url}\n`);
    let errorType = checkError(err, api_url);
    console.log(`END OF ERROR\n\n`);
    let err_message = 'Error: ';
    switch (errorType) {
        case TIMEOUT: {
            err_message += "Network Issues! Contact the developers if this error persists";
            break;
        }
        case UNAUTHORISED: {
            err_message += "Your session expired! Please login again";
            break;
        }
        case FORBIDDEN: {
            err_message += "Forbidden Resource! Please login again";
            break;
        }
        case GENERAL: {
            err_message += err.response.data.message ? err.response.data.message : "Error Occured! Please try again!";
            break;
        }
        case BUG: {
            err_message += "Bug occured! We are contacting our developers now!";
            break;
        }
        default: {
            err_message += "An Error Occured!";
            break;
        }
    }
    document.getElementById('launch_error').innerText = err_message;
    document.getElementById('launch_error').click();
}