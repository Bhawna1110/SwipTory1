const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = new Schema({
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bookmark_story_ids: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    liked_ids: {
        type: [Schema.Types.ObjectId],
        default: [] 
    }
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model('User', User);