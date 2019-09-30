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
  // Match the documents by query
  let query = `{
    "query": [
      {
        "$match": {
          "_year": "` + bizDate['year'] + `",
          "months.days.isHoliday": "N"
        }
      },
      {
        "$unwind": "$months"
      },
      {
        "$unwind": "$months.days"
      },
      {
        "$match": {
          "months.days.isHoliday": "N"
        }
      },
      {
        "$group": {
          "_id": {
            "_year": "$_year",
            "month": "$months.month"
          },
          "days": {
            "$push": "$months.days"
          }
        }
      },
      {
        "$sort": {"_id.month":1}
      },
      {
        "$group": {
          "_id": "$_id.''",
          "_year": {
            "$first": "$_id._year"
          },
          "months": {
            "$push": {
              "month": "$_id.month",
              "days": "$days"
            }
          }
        }
      }
    ]
  }`;

  return this.aggregate(JSON.parse(query)['query']);
}

dateSchema.statics.findByMonth = function (bizDate) {
  let query = `{
    "query": [
      {
        "$match": {
          "_year": "` + bizDate['year'] + `",
          "months.month": "` + bizDate['month'].zfill(2) + `",
          "months.days.isHoliday": "N"
        }
      },
      {
        "$unwind": "$months"
      },
      {
        "$unwind": "$months.days"
      },
      {
        "$match": {
          "months.month": "` + bizDate['month'].zfill(2) + `",
          "months.days.isHoliday": "N"
        }
      },
      {
        "$group": {
          "_id": {
            "_year": "$_year",
            "month": "$months.month"
          },
          "days": {
            "$push": "$months.days"
          }
        }
      },
      {
        "$group": {
          "_id": "$_id.''",
          "_year": {
            "$first": "$_id._year"
          },
          "months": {
            "$push": {
              "month": "$_id.month",
              "days": "$days"
            }
          }
        }
      }
    ]
  }`;

  return this.aggregate(JSON.parse(query)['query']);
}

dateSchema.statics.findByBetweenDate = function (bizDate) {
  let query = `{
    "query": [
      {
        "$match": {
          "_year": "` + bizDate['year'] + `",
          "months.days.isHoliday": "N"
        }
      },
      {
        "$unwind": "$months"
      },
      {
        "$unwind": "$months.days"
      },
      {
        "$match": {
          "months.days.isHoliday": "N"
        }
      },
      {
        "$set": {
          "YearMonthDay": {
            "$concat": [
              "$_year",
              "$months.month",
              "$months.days.day"
            ]
          }
        }
      },
      {
        "$match": {
          "$and": [
            {
              "YearMonthDay": {
                "$gte": "` + bizDate['startDate'] + `"
              }
            },
            {
              "YearMonthDay": {
                "$lte": "` + bizDate['endDate'] + `"
              }
            }
          ]
        }
      },
      {
        "$group": {
          "_id": {
            "_year": "$_year",
            "month": "$months.month"
          },
          "days": {
            "$push": "$months.days"
          }
        }
      },
      {
        "$sort": {"_id.month":1}
      },
      {
        "$group": {
          "_id": "$_id.''",
          "_year": {
            "$first": "$_id._year"
          },
          "months": {
            "$push": {
              "month": "$_id.month",
              "days": "$days"
            }
          }
        }
      }
    ]
  }`;

  return this.aggregate(JSON.parse(query)['query']);
}

// Fill zero("0") until size equal to String size
String.prototype.zfill = function (size) {
  let zs = this;
  while (zs.length < (size || 2)) {
    zs = "0" + zs;
  }
  return zs;
}

module.exports = mongoose.model("bizDay", dateSchema, "bizDay");
