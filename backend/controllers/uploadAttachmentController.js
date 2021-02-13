const sendResponse = require('../utils/apiOut').sendResponse;

const uploadAttachment = (req, res, next) => {
  if (req.file) {
    return sendResponse(res, 200, {
      success: true,
      status: 'Attachment Saved!',
      url: req.file.path.toString().slice(7),
    });
  }
  return sendResponse(res, 200, { success: false, status: 'Attachment Not Saved!', url: '' });
};

module.exports = {
  uploadAttachment,
};
