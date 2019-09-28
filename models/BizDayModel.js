var mongoose = require('mongoose');

var dateSchema = new mongoose.Schema({
    _year: String,
    months: [{
        month: String,
        days: [{
            day: String,
            isHoliday: String
        }]
    }]
});

dateSchema.statics.findByYear = function (bizDate) {
    let query = `
        {
          "$match": {
            "_year": "` + bizDate['year'] +`",
            "months": {
              "$elemMatch": {
                "days.isHoliday": "Y"
              }
            }
          }
        }`;
    let projector = `
        {
          "$addFields": {
            "months": {
              "$filter": {
                "input": {
                  "$map": {
                    "input": "$months",
                    "as": "m",
                    "in": {
                      "month": "$$m.month",
                      "days": {
                        "$filter": {
                          "input": "$$m.days",
                          "as": "d",
                          "cond": {
                                "$eq": ["$$d.isHoliday", "Y"]
                          }
                        }
                      }
                    }
                  }
                },
              "as": "m",
              "cond": {
                "$gt": [
                  {
                    "$size": "$$m.days"
                  },
                  0
                ]
                }
              }
            }
          }
        }`;
    console.log('JSON.stringify(query) :', JSON.parse(query));
    return this.aggregate([JSON.parse(query), JSON.parse(projector)]);
}

dateSchema.statics.findByMonth = function (bizDate) {
    let query = `
        {
          "$match": {
            "_year": "` + bizDate['year'] +`",
            "months": {
              "$elemMatch": {
                "month": "` + bizDate['month'].zfill(2) + `",
                "days.isHoliday": "Y"
              }
            }
          }
        }`;
    let projector = `
      {
        "$addFields": {
          "months": {
            "$filter": {
              "input": {
                "$map": {
                  "input": "$months",
                  "as": "m",
                  "in": {
                    "month": "$$m.month",
                    "days": {
                      "$filter": {
                        "input": "$$m.days",
                        "as": "d",
                        "cond": {
                          "$eq": [
                            "$$d.isHoliday",
                            "Y"
                          ]
                        }
                      }
                    }
                  }
                }
              },
              "as": "m",
              "cond": {
                "$and": [
                  { "$gt": [ {"$size": "$$m.days"}, 0 ] },
                  { "$eq": [ "$$m.month", "` + bizDate['month'].zfill(2) + `" ] }
                ]
              }
            }
          }
        }
      }`;
    return this.aggregate([JSON.parse(query), JSON.parse(projector)]);
}

/**
 * Fill zero("0") until size equal to String size
 * @param {*} size 
 */
String.prototype.zfill = function(size) {
    let zs = this;
    while(zs.length < (size || 2)) {
        zs = "0" + zs;
    }
    return zs;
}

module.exports = mongoose.model("bizDay", dateSchema, "bizDay");
