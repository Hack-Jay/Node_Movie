/**
 * Created by Administrator on 2017/6/26 0026.
 */
var mongoose=require('mongoose');
var UserSchemas=require('../schemas/user');

var User=mongoose.model('User',UserSchemas);

module.exports=User;