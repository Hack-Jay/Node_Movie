/**
 * Created by Administrator on 2017/6/27 0027.
 */
var mongoose=require('mongoose');

//Schema 模型，数据模型
var PostSchema=new mongoose.Schema({
        author: {
            type: String
        },
        title:String ,
        content: { type: 'string' },
        pv: { type: 'number' ,default:0},
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
PostSchema.pre('save', function (next) {
    var user=this;
    if(this.isNew){
        this.meta.creatAt=this.meta.updateAt=Date.now();
    }
    else{
        this.updateAt=Date.now();
    }
    next();
});

//静态方法
PostSchema.statics={
    fetch:function(cb){
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)//执行callback
    },
    findById:function(id,cb){
        return this
            .findOne({_id:id})
            .exec(cb)//执行callback
    }
}
module.exports=PostSchema;
