
const _backend_config = {
    development: {
        baseURL: "http://localhost:8080/espire",
        timeout: 3000,
    },
    staging: {
        baseURL: "https://espire-backend.onrender.com/espire",
        timeout: 60000,
    },
    production: {
        baseURL: "http://127.0.0.1:8080/espire",
        timeout: 3000,
    }
}

const getConfiguration = (env) => {
    // const platform = 'development';
    // const platform = 'production';
    const platform = 'staging';
    return _backend_config[platform];
}

module.exports = getConfiguration;