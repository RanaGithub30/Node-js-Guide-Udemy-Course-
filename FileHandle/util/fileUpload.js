const fs = require('fs').promises;
const multer = require('multer');
const path = require('path');

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Specify the directory where files will be stored
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for the uploaded file
        cb(null, Date.now() + '-' + file.originalname)
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

/**
 * Function to modify file name
*/

exports.modifyFileName = (fileName) => {
    // For example, append a timestamp to the file name
    const modifiedFileName = `${Date.now()}_${fileName}`;
    return modifiedFileName;
}

/**
 * Validate image file
 */
exports.validateImage = (file) => {
    // Get file extension
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // Allowed image extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];

    // Check if the file extension is allowed
    if (!allowedExtensions.includes(fileExtension)) {
        throw new Error('Invalid image file type. Only JPG, JPEG, and PNG files are allowed.');
    }

    if (file.size > 100 * 1024 * 1024) { // Max size 100MB
        throw new Error('Image file size exceeds the limit');
    }
}

// File upload helper function
exports.uploadFile = async (file, dirname) => {
    try {
        // Check if file object is provided
        if (!file) {
            throw new Error('No file was provided.');
        }

        // Access the uploaded file from the file object
        const uploadedFile = file;

        // Specify the directory where files will be stored
        const destination = path.join(__dirname, dirname, '/');

        // Create the directory if it doesn't exist
        await fs.mkdir(destination, { recursive: true });

        // Modify the file name
        const modifiedFileName = exports.modifyFileName(uploadedFile.originalname);
        console.log(modifiedFileName);

        // Save the file to disk
        const filePath = path.join(destination, modifiedFileName); // Use original name
       await fs.writeFile(filePath, uploadedFile.buffer);

        return { success: true, filePath: filePath };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Error uploading file.' };
    }
}

// Export the upload function
exports.upload = upload;