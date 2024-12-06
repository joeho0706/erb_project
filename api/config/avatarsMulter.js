const multer = require('multer');
const uploadPath = 'avatars';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // 使用文件名稱作為存儲名稱
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
