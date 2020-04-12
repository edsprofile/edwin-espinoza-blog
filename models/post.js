var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    content: String,
    createdAt: {type: Date, default: Date.Now}
});

module.exports = mongoose.model("Post", postSchema);
