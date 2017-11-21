# Node_Movie
for nodejs
##安装模块 : npm install 
#运行 : node index
#技术栈: Node + Express + MongoDB 

#功能: 
1.账号登录和注册,可设置管理员权限
2.电影的查看和豆瓣电影录入(豆瓣电影id）,可以读取电影视频预告
3.管理功能： 
    .账号的删改
    .电影的删改
    .分类的添加删改

#持久化状态: 采用express-session保存在数据库里
app.use(session({
    secret: 'blog',
    store: new mongoStore({
        url: dbUrl,
        collection: 'session'
    })
}));

电影的录入可以输入豆瓣id（豆瓣官网查询），会自动填充电影信息
具体请看代码
