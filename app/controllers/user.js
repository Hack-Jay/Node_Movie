/**
 * Created by Administrator on 2017/6/26 0026.
 */
var User=require('../models/user');

exports.showSignin=  function (req,res) {
    res.render('sign-denglu',{
        title:'登录页面'
    })
}
exports.showSignup=  function (req,res) {
    res.render('sign-zhuce',{
        title:'注册页面'
    })
}

exports.list= function (req, res) {
    User.find({}).sort('meta.updateAt').exec(function(err,user){
        if(err){
            console.log(err);
        }
        else{
            res.render('userlist',{
                title:'用户列表',
                users:user
            })
        }
    })
}



//用户注册
exports.signup=  function (req,res) {
    var _user=req.body.user;
    User.findOne({name:_user.name}, function (err, user) {
        if(err)
        {
            console.log(err);
        };
        if(user) {
            return res.render('404',{
                message:'用户名已存在！',
                url:'/sign-zhuce'
            })
        } else{
            var user=new User(_user);
            user.save(function (err, user) {
                if(err){console.log(err)}
                req.session.user=user;
                res.redirect('/')
            })
        }
    })
}
//用户登录
exports.signin= function (req, res) {
    var _user=req.body.user;
    var name=_user.name;
    var password=_user.password;
    User.findOne({name:name}, function (err, user) {
        if(err){console.log(err)}
        if(!user){
            return res.render('404',{
                message:'用户名不存在！',
                url:'/sign-denglu'
            })
        }
        user.comparePassword(password, function (err, isMatch) {
            if(err){console.log(err)}
            if(isMatch){
                console.log('登录成功！')
                req.session.user=user;
                return res.redirect('/')

            }
            else{return res.redirect('/sign-denglu')};

        })
    })
}
exports.logout= function (req, res) {
    delete req.session.user;
    res.redirect('/');
}

//用户登录和权限判断

exports.signinRequired=function(req,res,next){
    var user=req.session.user;

    if(!user){
        return res.redirect('/sign-denglu');
    }
    next();
}

exports.adminRequired=function(req,res,next){
    var user=req.session.user;

    if(user.role<=10){
        return res.render('404',{
            message:'用户权限不够！',
            url:'/sign-denglu'
        })
    }
    next();
}