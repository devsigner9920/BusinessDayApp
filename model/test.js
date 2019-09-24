var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var daySchema = new Schema({
    year : 'Number',
    months : 'Array'
});

module.exports =  mongoose.model('Day', daySchema);