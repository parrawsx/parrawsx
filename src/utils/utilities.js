const logger = require("./logger");
const fs = require("fs");
const path = require("path");
const OrionService = require("../services/orionService");
const moment = require("moment-timezone");

const mailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;






async function validateMail(email) {
    try {
        return await mailRegexp.test(email);
    } catch (_) {
        return false;
    }
}

async function validateUsername(username) {
    let usernameVali = "";
    let paswordVali = "";
    let mailVali = "";

    if (await validateMail(username)) {
        let splitmail = username.split("@");
        usernameVali = splitmail.shift();
        paswordVali = username;
        mailVali = username;
    } else {
        let usermail = username.concat("@smartcostadelsol.es");
        usernameVali = username;
        paswordVali = usermail;
        mailVali = usermail;
    }
    return { usernameVali, paswordVali, mailVali };
}

async function compareToArray(array1, array2) {
    try {
        let isValue = false;
        for (var i = 0; i < array1.length; i++) {
            for (var j = 0; j < array2.length; j++) {
                if (array1[i] == array2[j]) isValue = true;
            }
        }
        return isValue;
    } catch (_) {
        return false;
    }
}

async function removeItemFromArr(arr, item) {
    let i = arr.indexOf(item);
    arr.splice(i, 1);
    return arr;
}

async function deleteFolderRecursive(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
async function ultimatefolder(array) {
    let timeLastFolder = new Date("2000-01-01T00:00:00Z");
    let nameLastFolder = "";
    for (let folder_root of array) {
        let splitresult = folder_root.split("-");
        let first = splitresult.shift();
        let splitfirst = first.split("_");
        let namefirstFolder = new Date(splitfirst[0], splitfirst[1] - 1, splitfirst[2]);
        if (timeLastFolder < namefirstFolder) {
            timeLastFolder = namefirstFolder;
            nameLastFolder = folder_root;
        }
    }
    return nameLastFolder;
}
async function ultimateimage(arrayimage) {
    let numberLastImage = 0;
    let nameLastImage = "";
    for (let image of arrayimage) {
        let splitresult = image.split("_");
        let imageNumber = parseInt(splitresult[2]);

        if (numberLastImage < imageNumber) {
            numberLastImage = imageNumber;
            nameLastImage = image;
        }
    }
    return nameLastImage;
}

async function v_string(data) {
    return typeof data === "string" && /^[a-z]+$/i.test(data);
}

async function parseStringToNumberOrNull(data, exp) {
    try {
        let result;
        if (data === exp) {
            result = null;
        } else {
            result = Number(data);
        }
        if (isNaN(result)) result = data;
        return result;
    } catch (error) {
        return null;
    }
}

async function numAleatorio(inferior, superior) {
    let numPosibilidades = superior - inferior;
    let aleatorio = Math.random() * (numPosibilidades + 1);
    aleatorio = Math.floor(aleatorio);
    return inferior + aleatorio;
}
async function numAleatorioDecimal(inferior, superior) {
    let numPosibilidades = superior - inferior;
    let aleatorio = Math.random() * (numPosibilidades + 1);
    return inferior + aleatorio;
}

/**Inserción o updateo de la entidad en Orion Context Broker */
async function insertToOrionGeneral(service, subservice, Entity, nameEntity, nameType) {
    try {
        let resultOrion = "";
        logger.info(
            "util insertToOrionGeneral - Inicio [" +
                service +
                "] Subservicio [" +
                subservice +
                "] Entidad [" +
                nameEntity +
                "]"
        );
        let resultOrionSelect = await OrionService.orionSelectEntity(service, nameEntity, subservice);
        if (resultOrionSelect.errorOrionApi) {
            logger.error("util insertToOrionGeneral - Orion api could not be reached");
        } else if (resultOrionSelect.bodyOrion.id) {
            //UPDATE
            resultOrion = await OrionService.orionUpdate(Entity, service, resultOrionSelect.bodyOrion.id, subservice);
        } else {
            //INSERT
            Entity["id"] = nameEntity;
            Entity["type"] = nameType;
            resultOrion = await OrionService.orionInsert(Entity, service, subservice);
        }

        if (resultOrion.errorOrionApi) {
            logger.error("util insertToOrionGeneral - Orion api could not be reached");
        } else if (resultOrion.bodyOrion.error) {
            logger.error(resultOrion.bodyOrion.description);
        } else {
            logger.info(
                "util insertToOrionGeneral - Servicio [" +
                    service +
                    "] Subservicio [" +
                    subservice +
                    "] Entidad [" +
                    nameEntity +
                    "] actualizada en Orion Context Broker"
            );
        }
    } catch (err) {
        logger.error("util insertToOrionGeneral.", err);
    }
}

async function validationMeteo(object) {
    for (var attributename in object) {
        //console.log(attributename + ": " + object[attributename]);

        switch (attributename) {
            case "dataProvider":
            case "stationCode":
            case "stationName":
            case "pressureTendency":
                if (object[attributename] == "--") {
                    object[attributename] = null;
                }
                break;
            case "altitude":
            case "latitude":
            case "longitude":
            case "atmosphericPressure":
            case "atmosphericPressure_dmin":
            case "atmosphericPressure_dmax":
            case "evapotranspiration":
            case "evapotranspiration_dmin":
            case "evapotranspiration_dmax":
            case "solarRadiation":
            case "solarRadiation_dmin":
            case "solarRadiation_dmax":
            case "relativeHumidity":
            case "relativeHumidity_dmin":
            case "relativeHumidity_dmax":
            case "dewPoint":
            case "dewPoint_dmin":
            case "dewPoint_dmax":
            case "temperature":
            case "temperature_dmin":
            case "temperature_dmax":
            case "windChill":
            case "windchill_dmin":
            case "windchill_dmax":
            case "heatIndex":
            case "heatIndex_dmin":
            case "heatIndex_dmax":
            case "windDirection":
            case "windSpeed":
            case "windASpeed_dmin":
            case "windSpeed_dmax":
            case "windGustSpeed":
            case "windGustSpeed_dmin":
            case "windGustSpeed_dmax":
            case "feelLikes":
            case "feelLikes_dmin":
            case "feelLikes_dmax":
            case "precipitation":
            case "precipitationRate":
            case "precipitation_24h":
            case "precipitation_thismonth":
            case "precipitation_thisyear":
                if (object[attributename] == "--") {
                    object[attributename] = null;
                } else {
                    object[attributename] = Number(object[attributename]);
                }
                break;
            case "atmosphericPressure_dmintime":
            case "atmosphericPressure_dmaxtime":
            case "evapotranspiration_dmintime":
            case "evapotranspiration_dmaxtime":
            case "solarRadiation_dmintime":
            case "solarRadiation_dmaxtime":
            case "relativeHumidity_dmintime":
            case "relativeHumidity_dmaxtime":
            case "dewPoint_dmintime":
            case "dewPoint_dmaxtime":
            case "temperature_dmintime":
            case "temperature_dmaxtime":
            case "windchill_dmintime":
            case "windchill_dmaxtime":
            case "heatIndex_dmintime":
            case "heatIndex_dmaxtime":
            case "windSpeed_dmintime":
            case "windSpeed_dmaxtime":
            case "windGustSpeed_dmintime":
            case "windGustSpeed_dmaxtime":
            case "feelLikes_dmintime":
            case "feelLikes_dmaxtime":
                if (object[attributename] == "--") {
                    object[attributename] = null;
                } else {
                    object[attributename] = moment(object[attributename], "YYYYMMDDhhmmss").toISOString();
                }
                break;
        }
        //console.log(attributename + ": " + object[attributename]);
    }
}

async function gettimestamp(datenow) {
    let timeparse = "1970-01-01T00:00:00.00Z";
    if (typeof datenow !== "undefined" || datenow !== null) {
        if (String(datenow + "").length <= 10) datenow = Number(datenow + "000");
        const t = new Date(datenow);
        timeparse =
            t.getFullYear() +
            "-" +
            pad(t.getMonth() + 1) +
            "-" +
            pad(t.getDate()) +
            "T" +
            pad(t.getHours()) +
            ":" +
            pad(t.getMinutes()) +
            ":" +
            pad(t.getSeconds()) +
            "." +
            pad(t.getMilliseconds()) +
            "Z";
    }
    return timeparse;
}

module.exports = {
    validateUsername: validateUsername,
    validateMail: validateMail,
    compareToArray: compareToArray,
    removeItemFromArr: removeItemFromArr,
    deleteFolderRecursive: deleteFolderRecursive,
    ultimatefolder: ultimatefolder,
    ultimateimage: ultimateimage,
    numAleatorio: numAleatorio,
    numAleatorioDecimal: numAleatorioDecimal,
    insertToOrionGeneral: insertToOrionGeneral,
    parseStringToNumberOrNull: parseStringToNumberOrNull,
    validationMeteo: validationMeteo,
    gettimestamp:gettimestamp,
};
