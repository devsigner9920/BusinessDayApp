var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    _year: String,
    months: [{
            month: String,
            days: [{
                    day: String,
                    isHoliday: String
                }]
        }]
});

module.exports = mongoose.model("bizDate", schema, "bizDate");