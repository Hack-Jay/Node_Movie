/**
 * Created by Administrator on 2017/7/1 0001.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 获取ObjectId
const ObjectId = Schema.Types.ObjectId;

var commentSchema=new Schema({
    movie:{type:ObjectId,ref:'Movie'},
    from:{type:ObjectId,ref:'User'},
    reply:[{
        from:{type:ObjectId, ref:'User'},
        to:{type:ObjectId, ref:"User"},
        content:String
    }],
    content:String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

commentSchema.pre('save', function(next){
    // 如果是新添加的数据
    if (this.isNew) {
        // 那么当前时间就是当前创建与更新时间
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        // 如果不是新添加的话，那么更新时间为当前时间
        this.meta.updateAt = Date.now();
    }

    // 上面执行成功后，执行save方法
    next();
});

commentSchema.statics.fetch = function(callback) {
    return this.find({}).sort('meta.uodateAt').exec(callback);
}

// 添加静态方法----通过Id获取电影
commentSchema.statics.findById = function(commentid, callback) {
    return this.findOne({_id: commentid}).exec(callback);
}

// 导成这个schema
module.exports = commentSchema;