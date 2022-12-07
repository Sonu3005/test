const axios = require("axios");

module.exports = class Apis {
  static async post(url, data, _isInternal = true) {
    try {
      const payload = {
        url,
        data,
        method: "post",
        headers: {
          "content-type": "application/json",
        },
      };
      let result = await axios(payload);
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  static async get(url, params = "", _isInternal = true) {
    try {
      const qs = params;
      const payload = {
        params: qs,
        method: "get",
        headers: {
          "content-type": "application/json",
        },
      };
      let result = await axios.get(url, payload);
      return result.data;
    } catch (error) {
      throw error;
    }
  }
};
