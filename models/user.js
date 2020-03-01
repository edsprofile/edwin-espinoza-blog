var mongoose = require("mongoose")

var UserSchema = new mongoose.Schema({
    userName: String,
    password: String,
    email: {type: String, required: true, unique: true},
    isAdmin: {type: Boolean, default: false}
});

module.exports = mongoose.model("User", UserSchema);
