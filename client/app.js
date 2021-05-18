const express = require("express");
const app = express();
const morgan = require("morgan");

var events = require("./routes/events.js");
var customers = require("./routes/customers.js");
var webhooks = require("./routes/webhooks.js");
var notifications = require("./routes/notifications.js");

app.use(morgan("short"));
app.use(express.json());

app.use(events);
app.use(customers);
app.use(webhooks);
app.use(notifications);

module.exports = app;
