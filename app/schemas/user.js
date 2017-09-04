/**
 * Created by Administrator on 2017/6/26 0026.
 */
var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
var SALT_WORK_FACTOR=10;

//Schema 模型，数据模型
var UserSchema=new mongoose.Schema({
        name: {
            unique: true,
            type: String
        },
        password:String,
    //用户级别
        role:{
            type:Number,
            default:0
        },
    //记录时间
        meta:{
            creatAt:{
                type:Date,
                default:Date.now()
            },
            updateAt:{
                type:Date,
                default:Date.now()
            }
    }
    }
);
UserSchema.pre('save', function (next) {
    var user=this;
    if(this.isNew){
        this.meta.creatAt=this.meta.updateAt=Date.now();
    }
    else{
        this.updateAt=Date.now();
    }
    //密码加密
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err,salt) {
            if(err){return next(err)}
        bcrypt.hash(user.password,salt, function (err,hash) {
            if (err){
                return next(err)
            }
            user.password=hash;
            next();
        })
    })
});

//Schema实例方法
UserSchema.methods={
    comparePassword: function (_password,cb) {
        //调用bcrypt的对比方法
        bcrypt.compare(_password,this.password, function (err, isMatch) {
            if(err){
                return cb(err);
            }
            else{
                cb(null,isMatch)
            }
        })
    }
};

//静态方法
UserSchema.statics={
    featch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id,cb) {
        return this
            .find({_id:id})
            .exec(cb)
    }
};

module.exports=UserSchema;
