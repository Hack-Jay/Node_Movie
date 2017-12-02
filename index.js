var express = require('express');
var path = require('path');

var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var port = process.env.PORT || 5000;
var ejs = require('ejs');

var app = express();
var dbUrl = 'mongodb://localhost/blogtest';
//var dbUrl = 'mongodb://root:123456@ds151973.mlab.com:51973/node_test'

mongoose.connect(dbUrl);
console.log('Connect Suceess!');
app.set('/views', path.join(__dirname, './views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
//表单解析
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    secret: 'blog',
    store: new mongoStore({
        url: dbUrl,
        collection: 'session'
    })
}));


require('./config/routes')(app);



app.listen(port);

console.log('start on port' + port);