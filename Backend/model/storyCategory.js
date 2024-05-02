const mongoose = require('mongoose')
const Schema = require('mongoose').Schema;
const StoryCategoryList = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model('story_category', StoryCategoryList);