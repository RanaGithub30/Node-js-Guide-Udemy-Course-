const path = require('path');

const filePath = path.dirname(process.mainModule.filename);
module.exports = filePath;