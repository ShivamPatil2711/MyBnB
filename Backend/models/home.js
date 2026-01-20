const mongoose = require("mongoose");
const homeSchema = mongoose.Schema({
  housename: { type: String, required: true },
  price: { type: Number, required: true },
 street: { type: String, required: true },
 city: { type: String, required: true },
 pinCode: { type: String, required: true },
img: {
  url: { type: String, required: true },
  public_id: { type: String, required: true },
},

  des: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 
});
module.exports = mongoose.model("Home", homeSchema);
  