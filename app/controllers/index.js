/**
 * Created by Administrator on 2017/6/26 0026.
 */

var Movie=require('../models/movie')
var Category=require('../models/category')

exports.index= function (req,res) {
	Movie.find({}).sort('meta.updateAt').exec(function(err,movies){
		if(err){
			console.log(err);
		}
		else{
			 res.render('index',{
			 	movie:movies
			 })
		}
	})

};
exports.indexs= function (req, res) {
    Category.find({})
        .populate({
            path:'movies',
            select:'title poster summary',
            options:{limit:5}
        }).exec(function (err, categories) {
        if(err){
            console.log(err)
        }
        res.render('movie-index',{
            categories:categories
        })
    })
}