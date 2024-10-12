const path = require('path');

const rootFile = path.dirname(process.mainModule.filename);
const currentDir = path.join(rootFile, 'intro-to-express');

module.exports = currentDir;