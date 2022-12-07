let table = require("cli-table");

let tableData = new table();

let enviromentVariables = {
  "APPLICATION_PORT": {
    "message": "Required port no",
    "optional": false
  },
  "APPLICATION_ENV": {
    "message": "Required node environment",
    "optional": false
  },
  "MONGODB_URL": {
    "message": "Required mongodb url",
    "optional": false
  },
  "SALT_ROUNDS": {
    "message": "Required salt rounds for encryption",
    "optional": false
  },
  "ACCESS_TOKEN_SECRET": {
    "message": "Required access token secret",
    "optional": false
  },
  "REFRESH_TOKEN_SECRET": {
    "message": "Required refresh token secret",
    "optional": false
  },
  "ACCESS_TOKEN_EXPIRY": {
    "message": "Required access token expiry in days",
    "optional": false
  },
  "REFRESH_TOKEN_EXPIRY": {
    "message": "Required refresh token expiry in days",
    "optional": false
  },
  "ENABLE_LOG": {
    "message": "Required enable log boolean",
    "optional": false
  },
  "ENABLE_OTP_BASED_LOGIN": {
    "message": "Required enable otp based login",
    "optional": true
  },
  "REDIS_PORT": {
    "message": "Required redis PORT",
    "optional": true
  },
  "REDIS_HOST": {
    "message": "Required redis HOST",
    "optional": true
  },
  "FACTOR_2_API_KEY": {
    "message": "Required Api key for 2 Factor Service",
    "optional": true
  },
  "DEFAULT_OTP_EXPIRY": {
    "message": "Required login OTP expiry time in MS",
    "optional": true
  },
}

let success = true;

module.exports = function () {
  Object.keys(enviromentVariables).forEach(eachEnvironmentVariable => {

    let tableObj = {
      [eachEnvironmentVariable]: "PASSED"
    };

    let keyCheckPass = true;


    if (enviromentVariables[eachEnvironmentVariable].optional === true
      && enviromentVariables[eachEnvironmentVariable].requiredIf
      && enviromentVariables[eachEnvironmentVariable].requiredIf.key
      && enviromentVariables[eachEnvironmentVariable].requiredIf.key != ""
      && enviromentVariables[eachEnvironmentVariable].requiredIf.operator
      && validRequiredIfOperators.includes(enviromentVariables[eachEnvironmentVariable].requiredIf.operator)
      && enviromentVariables[eachEnvironmentVariable].requiredIf.value
      && enviromentVariables[eachEnvironmentVariable].requiredIf.value != "") {
      switch (enviromentVariables[eachEnvironmentVariable].requiredIf.operator) {
        case "EQUALS":
          if (process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] === enviromentVariables[eachEnvironmentVariable].requiredIf.value) {
            enviromentVariables[eachEnvironmentVariable].optional = false;
          }
          break;
        case "NOT_EQUALS":
          if (process.env[enviromentVariables[eachEnvironmentVariable].requiredIf.key] != enviromentVariables[eachEnvironmentVariable].requiredIf.value) {
            enviromentVariables[eachEnvironmentVariable].optional = false;
          }
          break;
        default:
          break;
      }
    }

    if (enviromentVariables[eachEnvironmentVariable].optional === false) {
      if (!(process.env[eachEnvironmentVariable])
        || process.env[eachEnvironmentVariable] == "") {
        success = false;
        keyCheckPass = false;
      } else if (enviromentVariables[eachEnvironmentVariable].possibleValues
        && Array.isArray(enviromentVariables[eachEnvironmentVariable].possibleValues)
        && enviromentVariables[eachEnvironmentVariable].possibleValues.length > 0) {
        if (!enviromentVariables[eachEnvironmentVariable].possibleValues.includes(process.env[eachEnvironmentVariable])) {
          success = false;
          keyCheckPass = false;
          enviromentVariables[eachEnvironmentVariable].message += ` Valid values - ${enviromentVariables[eachEnvironmentVariable].possibleValues.join(", ")}`
        }
      }
    }

    if ((!(process.env[eachEnvironmentVariable])
      || process.env[eachEnvironmentVariable] == "")
      && enviromentVariables[eachEnvironmentVariable].default
      && enviromentVariables[eachEnvironmentVariable].default != "") {
      process.env[eachEnvironmentVariable] = enviromentVariables[eachEnvironmentVariable].default;
    }

    if (!keyCheckPass) {
      if (enviromentVariables[eachEnvironmentVariable].message !== "") {
        tableObj[eachEnvironmentVariable] =
          enviromentVariables[eachEnvironmentVariable].message;
      } else {
        tableObj[eachEnvironmentVariable] = `FAILED - ${eachEnvironmentVariable} is required`;
      }
    }

    tableData.push(tableObj);
  })

  console.log(tableData.toString());

  return {
    success: success
  }
}
