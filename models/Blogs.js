const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title : {
        type : String ,
        required : true,
        text : true
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
    comment: 
      { 
        type: Object , 
        ref : 'Comment'
        }
    ,
    likes : [{
       type : ObjectID ,
       ref : "User"
    }],
    noOfLikes : {
        type : Number
    },
    noOfComment : {
        type : Number
    }, 
    blogImage : {
        type : String 
    }
})

const Blog = mongoose.model('blog' , blogSchema);

module.exports = Blog ; 