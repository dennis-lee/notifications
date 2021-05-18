const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  business_id: {
    type: String,
    required: true,
    unique: true,
  },
  verification_token: {
    type: String,
    required: true,
    unique: true,
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = { Customer };
