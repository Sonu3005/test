/**
 * name : middlewares/authenticator
 * author : Aman Kumar Gupta
 * Date : 27-Oct-2022
 * Description : Validating authorized requests
 */

const jwt = require("jsonwebtoken");

const HTTP_STATUS_CODE = require("../constants/http-status");
const API_MESSAGES = require("../constants/api-messages");
const APP_CONSTANTS = require("../constants/app-constants");

module.exports = async function (req, res, next) {
  try {
    let internalAccess = false;
    await Promise.all(
      APP_CONSTANTS.uploadUrls.map(async function (path) {
        if (req.path.includes(path)) {
          if (
            req.headers.internal_access_token &&
            process.env.INTERNAL_ACCESS_TOKEN ==
              req.headers.internal_access_token
          ) {
            internalAccess = true;
          }
        }
      })
    );

    if (internalAccess == true) {
      next();
      return;
    } else if (
      !APP_CONSTANTS.guestUrls.some((url) =>
        url.includes(req.url.split("?")[0])
      )
    ) {
      const authHeader = req.get("X-auth-token");

      /* Check to allow apis which are both guest and non guest apis */
      if (
        !authHeader &&
        APP_CONSTANTS.guestAndNonGuestUrls.some((url) =>
          url.includes(req.url.split("?")[0])
        )
      ) {
        req.decodedToken = undefined;
        return next();
      }

      if (!authHeader) {
        throw APP_CONSTANTS.failureResponse({
          message: API_MESSAGES.UNAUTHORIZED_REQUEST,
          statusCode: HTTP_STATUS_CODE.unauthorized,
          responseCode: "UNAUTHORIZED",
        });
      }
      let decodedToken;

      // let splittedUrl = req.url.split('/');
      // if (APP_CONSTANTS.uploadUrls.includes(splittedUrl[splittedUrl.length - 1])) {
      //     if (!req.headers.internal_access_token || process.env.INTERNAL_ACCESS_TOKEN !== req.headers.internal_access_token) {
      //         throw APP_CONSTANTS.failureResponse({ message: API_MESSAGES.INCORRECT_INTERNAL_ACCESS_TOKEN, statusCode: HTTP_STATUS_CODE.unauthorized, responseCode: 'UNAUTHORIZED' });
      //     }
      // }

      const authHeaderArray = authHeader.split(" ");
      if (authHeaderArray[0] !== "bearer") {
        throw APP_CONSTANTS.failureResponse({
          message: API_MESSAGES.UNAUTHORIZED_REQUEST,
          statusCode: HTTP_STATUS_CODE.unauthorized,
          responseCode: "UNAUTHORIZED",
        });
      }
      try {
        decodedToken = jwt.verify(
          authHeaderArray[1],
          process.env.ACCESS_TOKEN_SECRET
        );
        if (!APP_CONSTANTS.roles.some((role) => role === decodedToken.type)) {
          throw APP_CONSTANTS.failureResponse({
            message: API_MESSAGES.UNAUTHORIZED_REQUEST,
            statusCode: HTTP_STATUS_CODE.unauthorized,
            responseCode: "UNAUTHORIZED",
          });
        }
      } catch (err) {
        err.statusCode = HTTP_STATUS_CODE.unauthorized;
        err.responseCode = "UNAUTHORIZED";
        err.message = API_MESSAGES.ACCESS_TOKEN_EXPIRED;
        throw err;
      }

      if (!decodedToken) {
        throw APP_CONSTANTS.failureResponse({
          message: API_MESSAGES.UNAUTHORIZED_REQUEST,
          statusCode: HTTP_STATUS_CODE.unauthorized,
          responseCode: "UNAUTHORIZED",
        });
      }

      req.decodedToken = decodedToken;
    }

    next();
  } catch (err) {
    next(err);
  }
};
