const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title : {
        type : String ,
        required : true
    } ,
    body : {
        type : String , 
        required : true
    },
    postedBy : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    comments: [
        {
            body: String,
            by: mongoose.Schema.Types.ObjectId
        }
    ],
    isLiked : {
        type : Boolean , 
        default : false , 
        by : mongoose.Schema.Types.ObjectId
    },
    image : String
})

const Blog = mongoose.model('blog' , blogSchema);

module.exports = Blog ; 