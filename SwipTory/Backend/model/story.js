const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Stories = new Schema({
    story_category_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    heading: {
        type: String,
        required: true
    },
    story_category: {
        type: String,
        required: false
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
   
},{
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

module.exports = mongoose.model('Stories', Stories);