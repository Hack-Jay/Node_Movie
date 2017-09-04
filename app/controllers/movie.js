var _=require('underscore')     //引入extend，新object替换旧object中的字段
var Movie=require('../models/movie')
var Comment=require('../models/comment')
var Category=require('../models/category')


exports.index= function (req,res) {
	 Movie.fetch((error, movies) => {
        if (error) {
            console.log(error)
        } else {
            res.render('index', {
                title: '首页',
                movies: movies
            })
        }
    })
};


exports.new=function(req,res){
	Category.find({}, function (err,categories) {
		res.render('movie_new',{
			movie:{},
			categories:categories
		});
	})

};

// 后台录入页的post请求的处理--更新电影
exports.save = function(req, res){
	if (!req.body) {
		return res.sendStatus(400);
	}
	const movieId = req.body.movie._id;
	// 这个是获取的那个要更新的那个电影的id
	let movieObj = req.body.movie;
	let _movie = null;

	if (movieId) {
		// 如果movieId存在，那么就代表这个电影是修改状态
		// 先从数据库中找到这个电影,然后再执行修改
		Movie.findById(movieId, function(err, movie){
			if (err) {
				console.log(err);
			}

			// 修改分类----分为两个情况
			// 1.新增分类,或者2.修改分类
			// 如果两个都改了---那么就已定义的分类的为准
			if (movieObj.category && movieObj.category != movie.category ) {
				// 如果修改分类的id存在且不等于该电影的分类,那么就更新分类
				// 删除category电影的原来分类
				Category.findById(movie.category, function(err, category){
					category.movies.forEach(function(catemovie, index, arr){
						// 该分类下的中对应的电影id
						if (catemovie.toString() == movie._id.toString()) {
							// 删除掉这个分类下的电影id
							category.movies.splice(index,1);
							category.save(function(err, category){
								if (err) {
									console.log(err);
								}
							})
						}
					});
				});

				// 增加category修改分类
				Category.findById(movieObj.category, function(err, category){
					// 在修改的分类下，添加电影
					category.movies.push(movie._id);  //?????
					category.save(function(err, category){
						if (err) {
							console.log(err);
						}
						// 更新成功之后，跳转到详情页面
						res.redirect('/movie/' + movie._id);
					});
				});

				// 修改数据库中的数据，不使用underscore这个库
				// 直接使用update
				movie.update(movieObj, function(err, callback){
					if (err) {
						console.log(err);
					}
				});

			}else if(movieObj.categoryName){
				// 判断分类是否重名
				Category.find({name: movieObj.categoryName}, function(err, categories){
					if (err) {
						console.log(err);
					}
					// 重名了
					if (categories && categories.length > 0 ) {
						res.send('该分类重名了');
						return;
					}

					// 删除category电影的原来分类
					Category.findById(movie.category, function(err, category){
						category.movies.forEach(function(catemovie, index, arr){
							// 该分类下的中对应的电影id
							if (catemovie.toString() == movie._id.toString()) {
								// 删除掉这个分类下的电影id
								category.movies.splice(index,1);
								category.save(function(err, category){
									if (err) {
										console.log(err);
									}
								})
							}
						});
					});

					// 如果是新添加的分类
					// 新增加的分类---先更新分类
					const addnewCategory = new Category({
						name: movieObj.categoryName,
						movies: [movie._id]
					});

					addnewCategory.save(function(err,onecategory){
						if (err) {
							console.log(err);
						}
						// 更新新电影的--新分类的id
						movieObj.category = onecategory._id
						movie.update(movieObj, function(err, callback){
							if (err) {
								console.log(err);
							}
							// 更新成功之后，跳转到详情页面
							res.redirect('/movie/' + movie._id);
						});
					});
				});
			}
		});
	}else {
		// 查看是否是新增分类还是选择已经定义好的分类
		// 如果两个都选择了，那么以已定义好的分类为准
		// 这个分类的逻辑是-----一个电影只有一个分类
		const categoryId = movieObj.category;
		const categoryName = movieObj.categoryName;
		// 如果这个categoryId存在的话，那说明用户
		// 选择了已经定义好的分类
		if (categoryId) {
			Category.findById(categoryId, function(err, category){
				_movie = new Movie(movieObj);
				// 存储到数据库中----不仅把这个电影数据
				// 存储movie,然后把电影id存储到category中
				_movie.save(function(err, movie){
					if (err) {
						console.log(err);
					}
					// movie._id更新category中
					category.movies.push(movie._id);
					category.save(function(err, category){
						if (err) {
							console.log(err);
						}
						// 更新成功之后，跳转到详情页面
						res.redirect('/movie/' + movie._id);
					});
				});
			});
		}else if (categoryName) {
			// 判断分类是否重名
			Category.find({name: movieObj.categoryName}, function(err, categories){
				if (err) {
					console.log(err);
				}
				// 重名了
				if (categories && categories.length > 0 ) {
					res.send('该分类重名了');
					return;
				}

				// 新增加的分类---先更新分类

				const newCategory = new Category({
					name: categoryName,
					movies: []
				});

				newCategory.save(function(err,onecategory){
					if (err) {
						console.log(err);
					}
					movieObj.category = onecategory._id;
					_movie = new Movie(movieObj);

					_movie.save(function(err, movie){
						if (err) {
							console.log(err);
						}
						onecategory.movies.push(movie._id);
						onecategory.save(function(err, category){
							if (err) {
								console.log(err);
							}
							// 更新成功之后，跳转到详情页面
							res.redirect('/movie/' + movie._id);
						})
					});
				});

			});
		}
	}
};


//电影详情页
exports.detail=function(req,res){
	var id=req.params.id;
	Movie.update({_id:id},{$inc:{pv:1}}, function (err) {
		console.log(err)
	})
	Movie.findById(id,function(err,movie){
		if(err){console.log(err)};
		Comment
			.find({movie: id})
			.populate('from', 'name') //把from的这个字段---取对应users表中的name
			.exec(function(err, comments){
				res.render('movie_detail', {
					movie: movie,
					comments: comments
				});
			});
	});
}
//电影列表
exports.list=function(req,res){

	Movie.find({}).sort('meta.updateAt').exec(function(err,movies){
		if(err){
			console.log(err);
		}
		else{
			 res.render('movie_list',{
			 	title:'电影列表',
			 	movies:movies
			 })
		}
	})
}


exports.update=function(req,res){
	var id=req.params.id;
	if(id){
		// 从数据库中取出数据，
		// 再利用admin的模板渲染数据
		Movie.findById(id, function(err, movie){
			Category.find({}, function(err, categories){
				res.render('movie_new',{
					title: '后台电影更新页',
					movie: movie,
					categories: categories
				})
			});
		});
	}
}


exports.deleted=function(req, res){
	const movieId = req.query.id;

	// 如果movieId
	if (movieId) {
		Movie.findById(movieId, function (err,movies) {
			const categoryId=movies.category
			Category.findById(categoryId, function(err, category){
				category.movies.forEach(function(catemovie, index, arr){
					// 该分类下的中对应的电影id
					if (catemovie.toString() == movies._id.toString()) {
						// 删除掉这个分类下的电影id
						category.movies.splice(index,1);
						category.save(function(err, category){
							if (err) {
								console.log(err);
							}
						})
					}
				});
			});

			Movie.remove({_id: movieId}, function(err, movie){

				if (err) {
					console.log(err);
					return;
				}

				// 删除成功
				res.json({success: 1});
			});
		})

	}
}