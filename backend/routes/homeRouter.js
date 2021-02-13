const router = require('express').Router();
const uploadController = require('../controllers/uploadAttachmentController');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'public/Images',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });
router.route('/').get((req, res, next) => {
  console.log('Server reached');
  res.send('Hello World');
});
router.route('/uploadAttachment').post(upload.single('attachment'), uploadController.uploadAttachment);

module.exports = router;
