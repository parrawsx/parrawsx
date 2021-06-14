const winston = require("winston");
const path = require("path");
const user = "System";
const { levelLog } = require("../../config.js");
const logger = winston.createLogger({
    // You can also comment out the line above and uncomment the line below for JSON format
    // format: format.json(),
    levels: winston.config.syslog.levels,
    transports: [
        new winston.transports.Console({
            level: levelLog.level,
            format: winston.format.combine(
                winston.format.label({ label: "SKELETON", user: user }), //path.basename(process.mainModule.filename) }),
                winston.format.simple(),
                winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json(),
                winston.format.prettyPrint(),
                winston.format.printf(
                    (info) =>
                        `${info.timestamp} - ${info.level} [${info.label}] [${info.user || "System"}]: ${info.message}`
                )
            ),
        }),
    ],
});

logger.morgan = {
    write: function (message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;
