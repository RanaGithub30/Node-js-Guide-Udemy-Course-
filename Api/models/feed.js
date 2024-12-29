const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = new Schema(
    {
      title: {
        type: String,
        required: true
      },
      imageUrl: {
        type: String,
        required: false
      },
      content: {
        type: String,
        required: true
      },
      creator: {
        type: String,
        required: true
      },
    },
    { timestamps: true } // Moved inside the Schema constructor
);
  
module.exports = mongoose.model('Feed', feedSchema);