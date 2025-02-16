const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true
        },
        password: {
          type: String,
          required: true
        },
        status: {
          type: String,
          required: true
        },
        feeds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Feed'
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);