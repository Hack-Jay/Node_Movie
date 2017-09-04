/**
 * Created by Administrator on 2017/7/3 0003.
 */
var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var ObjectId=Schema.Types.ObjectId;

var categorySchema=new mongoose.Schema({
    name:String ,
    movies:[{type:ObjectId,ref:'Movie'}],
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

categorySchema.pre('save',function(next){
    if(this.isNew){
        this.meta.createAt=this.meta.updateAt=Date.now()
    }
    else{
        this.meta.updateAt=Date.now()
    }
    next();
})

categorySchema.static={
    fetch:function(cb){
        return this.find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById:function(id,cb){
        return this.findOne({_id:id})
            .exec(cb)
    }
}

module.exports=categorySchema;