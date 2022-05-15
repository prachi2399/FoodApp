const mongoose = require('mongoose');
const emailValidator=require('email-validator');
const crypto = require('crypto');

const db_link='mongodb+srv://prachi:EQOg4V51PNLd3rDR@cluster0.mvwd0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// EQOg4V51PNLd3rDR
mongoose.connect(db_link)
.then(function (db) {
    // console.log(db);
    console.log("plan db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: [20, "plan name should not exceed more than 20 characters"],
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: [true, "price not entered"],
  },
  ratingsAverage: {
    type: Number,
  },
  discount: {
    type: Number,
    validate: [
      function () {
        return this.discount < 100;
      },
      "dicount should not exceed price",
    ],
  },
  noOfRating:{
    type:Number,
    default:0
}
});

// model
const planModel = mongoose.model("planModel", planSchema);

// (async function createPlan() {
//   let planObj = {
//     name: "SuperFood10",
//     duration: 30,
//     price: 1000,
//     ratingsAverage: 5,
//     discount: 20,
//   };
//   // let data= await planModel.create(planObj);
//   // console.log(data);
//   const doc = new planModel(planObj);
//   await doc.save();
// })();

module.exports = planModel; 