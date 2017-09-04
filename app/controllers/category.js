/**
 * Created by Administrator on 2017/7/3 0003.
 */
var Category=require('../models/category');

exports.new=function(req,res){
    res.render('category_new',{
        title:'后台录入页'
    });
};

exports.save= function (req, res) {
    var _category=req.body.category;
    var category=new Category(_category);
    category.save(function (err, categories) {
        if(err){
            console.log(err)
        }
        res.redirect('/admin/category/list')
    })
}
//分类列表
exports.list=function(req,res){

    Category.find({}).sort('meta.updateAt').exec(function(err,categories){
        if(err){
            console.log(err);
        }
        else{
            res.render('category_list',{
                title:'分类列表',
                categories:categories
            })
        }
    })
}

