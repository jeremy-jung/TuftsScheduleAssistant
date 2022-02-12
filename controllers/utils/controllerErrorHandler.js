const resHandler = require("resHandler.js");

exports.getErrorHandler = controllerName => (
    (err, endpoint, res, userid, userrole) => {
        console.error(`(${controllerName}/${endpoint}) err: `, err);
        // save error if user is not developer
        const saveError = userrole !== "developer";
        if (err.detail !== undefined && err.title != undefined) {
            /* this is internally formatted error */
            resHandler.respondWithCustomError(userid, endpoint, err.id, err.status, err.title, err.detail, err.detail, saveError, res);
        } else {
            resHandler.respondWithCustomError(userid, endpoint, "000", "500", "Internal Server Error", err.toString(), err.toString(), saveError, res);
        }
    }
);
