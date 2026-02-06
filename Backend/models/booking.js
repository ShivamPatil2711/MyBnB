const mongoose = require("mongoose");
const home = require("./home");

const BookingSchema = mongoose.Schema({
  name: { type: String, required: true }, // Changed from FirstName/LastName to single name field
  email: { type: String, required: true },
  age: { type: Number, required: true },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  reviews:{
    rating: Number,
    comment: String,
  },
  homeId: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Changed from 'us' to 'userId'
});

module.exports = mongoose.model("Booking", BookingSchema);