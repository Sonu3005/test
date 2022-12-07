/**
 * name : constants/common.js
 * author : Aman Kumar Gupta
 * Date : 27-Oct-2022
 * Description : All commonly used constants through out the service
 */

const userType = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  EMPLOYEE: "EMPLOYEE",
};

const responseCode = {
  CLIENT_ERROR: "CLIENT_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  RESOURCE_ERROR: "RESOURCE_ERROR",
};

module.exports = {
  pagination: {
    DEFAULT_PAGE_NO: 1,
    DEFAULT_PAGE_SIZE: 20,
  },
  guestUrls: [],
  guestAndNonGuestUrls: [],
  uploadUrls: [],
  userType,
  responseCode,
  accessTokenExpiry: `${process.env.ACCESS_TOKEN_EXPIRY}d`,
  refreshTokenExpiry: `${process.env.REFRESH_TOKEN_EXPIRY}d`,
  refreshTokenExpiryInMs:
    Number(process.env.REFRESH_TOKEN_EXPIRY) * 24 * 60 * 60 * 1000,
  enableOtpBasedLogin: process.env.ENABLE_OTP_BASED_LOGIN,
  defaultOtpExpiry: process.env.DEFAULT_OTP_EXPIRY,
  mediaLimit: 1,
};
