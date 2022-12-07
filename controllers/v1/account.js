/**
 * name : account.js
 * author : Aman Gupta
 * created-date : 27-Oct-2022
 * Description : User Account.
 */

// Dependencies
const AccountService = require("../../core-services/v1/account");
module.exports = class Account {
  /**
   * create user account
   * @method
   * @name create
   * @param {Object} req -request data.
   * @param {Object} req.body -request body contains user creation deatils.
   * @param {String} req.body.email - user email.
   * @param {String} req.body.password - user password.
   * @returns {JSON} - response contains account creation details.
   */
  async create(req) {
    const params = req.body;
    try {
      return await AccountService.create(params);
    } catch (error) {
      throw error;
    }
  }
};
