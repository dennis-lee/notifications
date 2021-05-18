const mongoose = require("mongoose");

const WebhookSchema = new mongoose.Schema({
  business_id: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    unique: true,
  },
  target: {
    type: String,
    unique: true,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
});

const Webhook = mongoose.model("Webhook", WebhookSchema);

module.exports = { Webhook };
