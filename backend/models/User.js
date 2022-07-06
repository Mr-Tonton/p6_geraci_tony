const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    email: { type: String, 
        required: true, 
        unique: true, 
        validate: {
            validator: function(v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/.test(v);
            }
        } },
    password: { type: String, required: true }
});

userSchema.plugin

module.exports = mongoose.model("User", userSchema);