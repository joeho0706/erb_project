const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const exportPath = path.join(__dirname, '..', 'public', 'exports');
    fs.mkdirSync(exportPath, { recursive: true });
    cb(null, exportPath);
  },
  filename: (req, file, cb) => {
    cb(null, 'users.json');
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
