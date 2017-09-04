var mongoose=require('mongoose');
var MovieSchemas=require('../schemas/movie');

var Movie=mongoose.model('Movie',MovieSchemas);

module.exports=Movie;