/**
 * name : account.js
 * author : Aman Gupta
 * created-date : 03-Nov-2021
 * Description : account helper.
 */

// Dependencies
const ObjectId = require("mongoose").Types.ObjectId;
const {
  successResponse,
  failureResponse,
} = require("../../generics/utilities");
const HTTP_STATUS_CODE = require("../../constants/http-status");
const API_MESSAGES = require("../../constants/api-messages");
const APP_CONSTANTS = require("../../constants/app-constants");

module.exports = class AccountService {
  static async create(bodyData) {
    try {
      const fail = false;

      if (fail) {
        throw failureResponse({
          message: API_MESSAGES.VALIDATION_ERROR,
          statusCode: HTTP_STATUS_CODE.client_validation,
          responseCode: APP_CONSTANTS.responseCode.CLIENT_ERROR,
        });
      }

      return successResponse({
        statusCode: HTTP_STATUS_CODE.created,
        message: API_MESSAGES.USER_CREATED_SUCCESSFULLY,
        result: [],
      });
    } catch (error) {
      throw error;
    }
  }
};
