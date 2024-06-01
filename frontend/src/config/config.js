const _keycloak_config = {
    development: {
        "clientId": "React-Timeline-Auth",
        "realm": "keycloak-timeline-auth",
        url: "http://localhost:8080/auth",
        "ssl-required": "external",
        "resource": "React-Timeline-Auth",
        "public-client": true,
        "verify-token-audience": true,
        "use-resource-role-mappings": true,
        "confidential-port": 0
    },
    staging: {
        "clientId": "React-Timeline-Auth",
        "realm": "keycloak-timeline-auth",
        url: "http://keycloak:8080/auth",
        "ssl-required": "external",
        "resource": "React-Timeline-Auth",
        "public-client": true,
        "verify-token-audience": true,
        "use-resource-role-mappings": true,
        "confidential-port": 0
    },
    production: {
        "clientId": "React-Timeline-Auth",
        "realm": "keycloak-timeline-auth",
        url: "http://127.0.0.1:8080/auth",
        // "auth-server-url": "http://localhost:8080/auth",
        "ssl-required": "external",
        "resource": "React-Timeline-Auth",
        "public-client": true,
        "verify-token-audience": true,
        "use-resource-role-mappings": true,
        "confidential-port": 0
    }
}

const _backend_config = {
    development: {
        baseURL: "http://localhost:8081",
        timeout: 3000,
    },
    staging: {
        baseURL: "http://localhost:8081",
        timeout: 3000,
    },
    production: {
        baseURL: "http://127.0.0.1:8081",
        timeout: 3000,
    }
}

const getConfiguration = (env) => {
    // const platform = 'development';
    // const platform = 'production';
    const platform = 'staging';
    return env == 'keycloak' ? _keycloak_config[platform] : _backend_config[platform];
}

module.exports = getConfiguration;