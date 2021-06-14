const logger = require("./logger");
module.exports = {
    truthy: (...values) => (message, statusCode, description) => {
        logger.log("debug", "Error a evaluar: [" + message + "]");
        for (let i = 0; i < values.length; i++) {
            if (!values[i]) {
                throw {
                    statusCode,
                    json: {
                        message,
                    },
                };
            }
        }
    },

    error: (statusCode, message) => {
        throw {
            statusCode,
            json: {
                message,
            },
        };
    },
    isArray: (value) => {
        return Array.isArray(value) && value.length > 0;
    },
    safeGet: (obj, path) => {
        let value = obj;
        for (let prop of path.split(".")) {
            value = value[prop];
            if (value === undefined) {
                break;
            }
        }
        return value;
    },
    safeWrap: (obj) => (path) => {
        let value = obj;
        for (let prop of path.split(".")) {
            value = value[prop];
            if (value === undefined) {
                break;
            }
        }
        return value;
    },
};
