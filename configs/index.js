/**
 * name : configs
 * author : Aman Kumar Gupta
 * Date : 27-Oct-2022
 * Description : Contains connections of all configs
 */

//Dependencies
require("./mongodb")();

const path = require("path");

global.PROJECT_ROOT_DIRECTORY = path.join(__dirname, "..");
