var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment : {
    type : String 
  },
  by : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Blog'
  }
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;