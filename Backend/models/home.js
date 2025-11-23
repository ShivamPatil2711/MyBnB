const mongoose = require("mongoose");
const homeSchema = mongoose.Schema({
  housename: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rate: { type: Number, required: true },
  img:{ type: String, required: true }, 
  des: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
});
module.exports = mongoose.model("Home", homeSchema);







