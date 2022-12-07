/**
 * name : routes
 * author : Aman Kumar Gupta
 * Date : 27-Oct-2022
 * Description : Routes for available service
 */

const expressValidator = require("express-validator");
const express = require("express");
const path = require("path");

const authenticator = require("../middlewares/authenticator");
const pagination = require("../middlewares/pagination");
const upload = require("../middlewares/fileUpload");
const validator = require("../middlewares/validator");
const APP_CONSTANTS = require("../constants/app-constants");
const API_MESSAGES = require("../constants/api-messages");
const HTTP_STATUS_CODE = require("../constants/http-status");

module.exports = (app) => {
  app.use("/api/assets", express.static(path.join(__dirname, "../", "assets")));
  app.use(authenticator);
  app.use(pagination);
  app.use(expressValidator());
  app.use(upload.array("file", APP_CONSTANTS.mediaLimit));

  async function router(req, res, next) {
    let controllerResponse;
    let validationError;

    /* Check for input validation error */
    try {
      validationError = req.validationErrors();
    } catch (error) {
      error.statusCode = HTTP_STATUS_CODE.client_validation;
      error.responseCode = APP_CONSTANTS.responseCode.CLIENT_ERROR;
      return next(error);
    }

    if (validationError.length) {
      const error = new Error(API_MESSAGES.VALIDATION_ERROR);
      error.statusCode = HTTP_STATUS_CODE.client_validation;
      error.responseCode = APP_CONSTANTS.responseCode.CLIENT_ERROR;
      error.data = validationError;
      return next(error);
    }

    try {
      let controller;
      if (req.params.file) {
        let folderExists = fs.existsSync(
          PROJECT_ROOT_DIRECTORY +
            "/controllers/" +
            req.params.version +
            "/" +
            req.params.controller +
            "/" +
            req.params.file +
            ".js"
        );
        if (folderExists) {
          controller = require(`../controllers/${req.params.version}/${req.params.controller}/${req.params.file}`);
        } else {
          controller = require(`../controllers/${req.params.version}/${req.params.controller}`);
        }
      } else {
        controller = require(`../controllers/${req.params.version}/${req.params.controller}`);
      }
      controllerResponse = new controller()[req.params.method]
        ? await new controller()[req.params.method](req)
        : next();
    } catch (error) {
      // If controller or service throws some random error
      console.error("SERVER_ERROR", error);
      return next(error);
    }

    /* Handling Response */

    if (
      controllerResponse.statusCode !== HTTP_STATUS_CODE.ok &&
      controllerResponse.statusCode !== HTTP_STATUS_CODE.created &&
      controllerResponse.statusCode !== HTTP_STATUS_CODE.accepted
    ) {
      /* If error obtained then global error handler gets executed */
      console.error("CLIENT_ERROR", error);
      return next(controllerResponse);
    }

    if (controllerResponse.result && controllerResponse.result.filePath) {
      res.sendFile(
        path.join(__dirname, "../", controllerResponse.result.filePath)
      );
    } else if (
      controllerResponse.result &&
      controllerResponse.result.isResponseAStream == true
    ) {
      const exists = fs.existsSync(controllerResponse.result.fileNameWithPath);
      if (exists) {
        res.setHeader(
          "Content-disposition",
          "attachment; filename=" +
            controllerResponse.result.fileNameWithPath.split("/").pop()
        );
        res.set("Content-Type", "application/octet-stream");
        const stream = fs.createReadStream(
          controllerResponse.result.fileNameWithPath
        );
        stream.pipe(res);
        stream.on("end", () => {
          if (controllerResponse.result.remove) {
            fs.unlink(controllerResponse.result.fileNameWithPath, (err) => {
              if (err) {
                console.log(err);
              }
            });
          }
        });
      } else {
        const error = new Error(API_MESSAGES.FILE_NOT_FOUND);
        error.statusCode = HTTP_STATUS_CODE.not_found;
        return next(error);
      }
    } else {
      res.status(controllerResponse.statusCode).json({
        responseCode: controllerResponse.responseCode,
        statusCode: controllerResponse.statusCode,
        message: controllerResponse.message,
        result: controllerResponse.result,
        meta: controllerResponse.meta,
      });
    }
  }

  app.all("/api/:version/:controller/:method", validator, router);
  app.all("/api/:version/:controller/:method/:id", validator, router);
  app.all("/api/:version/upload/:controller/:file/:method", validator, router);
  app.all(
    "/api/:version/upload/:controller/:file/:method/:id",
    validator,
    router
  );

  app.use((req, res, next) => {
    res.status(HTTP_STATUS_CODE.not_found).json({
      responseCode: "RESOURCE_ERROR",
      statusCode: HTTP_STATUS_CODE.not_found,
      message: API_MESSAGES.RESOURCE_NOT_FOUND,
      error: [],
    });
  });

  // Global error handling middleware, should be present in last in the stack of a middleware's
  app.use((error, req, res, next) => {
    const statusCode =
      error.statusCode || HTTP_STATUS_CODE.internal_server_error;
    const responseCode = error.responseCode || "SERVER_ERROR";
    const message = error.message || "";
    let errorData = [];

    if (error.data) {
      errorData = error.data;
    }

    console.error("---GLOBAL_ERROR---", error);

    res.status(statusCode).json({
      responseCode,
      statusCode,
      message,
      error: errorData,
    });
  });
};
