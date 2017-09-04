/**
 * Created by Administrator on 2017/7/3 0003.
 */
var mongoose=require('mongoose');
var CategorySchemas=require('../schemas/category');

var Category=mongoose.model('Category',CategorySchemas);

module.exports=Category;