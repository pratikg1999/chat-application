const sendResponse = (res, statusCode = 200, jsonBody) => {
  return res.status(statusCode).json(jsonBody);
};

module.exports = { sendResponse };
