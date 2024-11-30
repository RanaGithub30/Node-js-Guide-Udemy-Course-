const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dirPath = require('./path');

// Ensure the directory exists and set permissions
const uploadDirectory = path.join(dirPath, '/images/');
if (!fs.existsSync(uploadDirectory)) {
  try {
    // Create the directory with appropriate permissions
    fs.mkdirSync(uploadDirectory, { recursive: true, mode: 0o755 }); // rwxr-xr-x
    console.log(`Directory created: ${uploadDirectory}`);
  } catch (err) {
    console.error(`Failed to create directory: ${err.message}`);
  }
}

// Multer storage and filter
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const safeTimestamp = new Date().toISOString().replace(/:/g, '-');
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${safeTimestamp}-${sanitizedFilename}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Export configured Multer instance
module.exports = multer({ storage: fileStorage, fileFilter: fileFilter });