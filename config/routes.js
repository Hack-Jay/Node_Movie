/**
 * Created by Administrator on 2017/6/26 0026.
 */

var Index=require('../app/controllers/index');
var User=require('../app/controllers/user');
//var Post=require('../app/controllers/post')
var Movie=require('../app/controllers/movie');
var Comment=require('../app/controllers/comment')
var Category=require('../app/controllers/category')

module.exports=function(app) {
//pre handle user
app.use(function(req,res,next){
        app.locals.user=req.session.user;   //app.locals为本地的常量，可挂载信息
        next();
})

    app.get('/',Index.index);
    app.get('/movie-index',Index.indexs)
//user
    app.post('/user/signup',User.signup);       //提交注册页面
    app.post('/user/signin',User.signin);       //提交登录页面
    app.get('/sign-denglu',User.showSignin);
    app.get('/sign-zhuce',User.showSignup);
    app.get('/logout',User.logout);
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
    // //post
    // app.get('/admin/post/new',Post.new);
    // app.post('/admin/post/new',Post.new);

//movie

    app.get('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.new);
    app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.save);
    app.get('/movie/:id',User.signinRequired,User.adminRequired,Movie.detail);
    app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list)
    app.get('/admin/update/:id',User.signinRequired,User.adminRequired,Movie.update)
    //app.delete('/admin/movie/list',movie.delete)
    app.delete('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.deleted );

    //comment
    app.post('/admin/comment',User.signinRequired,User.adminRequired,Comment.save )

    //category
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
    app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);

    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);

    //404
    app.get('/404', function (req, res) {
        res.render('404',{
            message:'',
            url:'/'
        });
    })
//

}
