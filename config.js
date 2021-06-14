function resolveUris(NODE_ENV) {

    if (NODE_ENV === "develop") {
        return {
            levellog: "warn"
        };
    }
    return {
        levellog: "debug"
    };
}

module.exports = {
    levelLog: {
        level: resolveUris(process.env.NODE_ENV).levellog,
    }
};
