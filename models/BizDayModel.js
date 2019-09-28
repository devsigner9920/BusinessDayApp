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
  let match1 = `
  {
    "$match": {
      "_year" : "2019",
      "months.days.isHoliday": "N"
    }
  }`

  // De-normalize nested array
  let unwind1 = `{ "$unwind": "$months" }`
  let unwind2 = `{ "$unwind": "$months.days" }`

  // Filter the actual array elements as desired
  let match2 = `{
    "$match": {
      "months.days.isHoliday": "N"
      }
  }`
  let set = `
  {
    "$set" : {
      "YearMonthDay" : { "$concat" : ["$_year", "$months.month", "$months.days.day"] }
    }
  }`
  let match3 = `
  {
    "$match": {
      "$and": [
        { "YearMonthDay": { "$gte": "20191015" } },
        { "YearMonthDay": { "$lte": "20191031" } }
      ]
    }
  }`

  // Group the intermediate result.
  let group1 = `
  {
    "$group": {
      "_id": { "_id": "$_id", "_year": "$_year", "month": "$months.month" },
      "days": { "$push": "$months.days" }
    }
  }`

  // Group the final result
  let group2 = `
  {
    "$group": {
      "_id": "$_id._id",
      "_year": { "$first": "$_id._year" },
      "months": {
        "$push": {
          "month": "$_id.month",
            "days": "$days"
        }
      }
    }
  }`;

  return this.aggregate([JSON.parse(match1),JSON.parse(unwind1),JSON.parse(unwind2),JSON.parse(match2),JSON.parse(set),JSON.parse(match3),JSON.parse(group1), JSON.parse(group2)]);
}

dateSchema.statics.findByMonth = function (bizDate) {
  let query = `
  {
    "$match": {
      "_year": "` + bizDate['year'] + `",
        "months": {
        "$elemMatch": {
          "month": "` + bizDate['month'].zfill(2) + `",
            "days.isHoliday": "N"
        }
      }
    }
  } `;
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
                        "N"
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
              { "$gt": [{ "$size": "$$m.days" }, 0] },
              { "$eq": ["$$m.month", "` + bizDate['month'].zfill(2) + `"] }
            ]
          }
        }
      }
    }
  } `;
  return this.aggregate([JSON.parse(query), JSON.parse(projector)]);
}

/**
 * Fill zero("0") until size equal to String size
 * @param {*} size 
 */
String.prototype.zfill = function (size) {
  let zs = this;
  while (zs.length < (size || 2)) {
    zs = "0" + zs;
  }
  return zs;
}

module.exports = mongoose.model("bizDay", dateSchema, "bizDay");
