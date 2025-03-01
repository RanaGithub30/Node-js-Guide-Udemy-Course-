const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = {
    createUser: async function ({ userInput }, req){
        const email = userInput.email;

        const existingUser = await User.findOne({email: email});
        if(existingUser){
            const err = new Error('User Exists Already');
            throw err;
        }

        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const newUser = new User({
            email: email,
            name: userInput.name,
            password: hashedPw,
            status: "active"
        });

        const createdUser = await newUser.save();
        return { ...createdUser._doc, _id: createdUser._id.toString()};
    }
}