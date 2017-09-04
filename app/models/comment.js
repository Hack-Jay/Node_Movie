/**
 * Created by Administrator on 2017/7/1 0001.
 */
var mongoose=require('mongoose');
var commentSchemas=require('../schemas/comment');

var Comment=mongoose.model('Comment',commentSchemas);

module.exports=Comment;