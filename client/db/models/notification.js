const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now(),
  },
  target: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  business_id: {
    type: String,
    required: true,
  },
  customer_verification_token: {
    type: String,
    required: true,
  },
  idempotency_key: {
    type: String,
    unique: true,
    default: null,
  },
  retry_count: {
    type: Number,
    default: 0,
  },
  next_retry: {
    type: Date,
    default: new Date(Date.now() + 30000),
  },
  expired: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification };
