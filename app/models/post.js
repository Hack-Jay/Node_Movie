/**
 * Created by Administrator on 2017/6/27 0027.
 */
var mongoose=require('mongoose');
var PostSchema=require('../schemas/post');

var Post=mongoose.model('Post',PostSchema);

module.exports=Post;